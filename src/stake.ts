import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { IProposalOutcome} from './proposal'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { BN, createGraphQlQuery, isAddress } from './utils'

export interface IStakeStaticState {
  id?: string
  staker: Address
  createdAt: Date | undefined
  outcome: IProposalOutcome
  amount: typeof BN // amount staked
  proposal: string
}

export interface IStakeState extends IStakeStaticState {
  id: string
}

export interface IStakeQueryOptions extends ICommonQueryOptions {
  where?: {
    id?: string
    staker?: Address
    dao?: Address
    proposal?: string
    createdAt?: number
    [key: string]: any
  }
}

export class Stake implements IStateful<IStakeState> {
  public static fragments = {
    StakeFields: gql`fragment StakeFields on ProposalStake {
      id
      createdAt
      dao {
        id
      }
      staker
      proposal {
        id
      }
      outcome
      amount
    }`
  }

  /**
   * Stake.search(context, options) searches for stake entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. IStakeQueryOptions
   * @return         an observable of Stake objects
   */
  public static search(
    context: Arc,
    options: IStakeQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable <Stake[]> {
    if (!options.where) { options.where = {}}
    let where = ''

    const proposalId = options.where.proposal
    // if we are searching for stakes on a specific proposal (a common case), we
    // will structure the query so that stakes are stored in the cache together wit the proposal
    if (proposalId) {
      delete options.where.proposal
    }

    for (const key of Object.keys(options.where)) {
      if (options.where[key] === undefined) {
        continue
      }

      if (key === 'staker' || key === 'dao') {
        const option = options.where[key] as string
        isAddress(option)
        options.where[key] = option.toLowerCase()
      }

      where += `${key}: "${options.where[key] as string}"\n`
    }

    let query
    const itemMap = (r: any) => {
      let outcome: IProposalOutcome = IProposalOutcome.Pass
      if (r.outcome === 'Pass') {
        outcome = IProposalOutcome.Pass
      } else if (r.outcome === 'Fail') {
        outcome = IProposalOutcome.Fail
      } else {
        throw new Error(`Unexpected value for proposalStakes.outcome: ${r.outcome}`)
      }
      return new Stake({
        amount: new BN(r.amount || 0),
        createdAt: r.createdAt,
        id: r.id,
        outcome,
        proposal: r.proposal.id,
        staker: r.staker
      }, context)
    }

    if (proposalId) {
      query = gql`query ProposalStakesSearchFromProposal
        {
          proposal (id: "${proposalId}") {
            id
            stakes ${createGraphQlQuery(options, where)} {
              ...StakeFields
            }
          }
        }
        ${Stake.fragments.StakeFields}
      `

      return context.getObservableObject(
        query,
        (r: any) => {
          if (r === null) { // no such proposal was found
            return []
          }
          const stakes = r.stakes
          return stakes.map(itemMap)
        },
        apolloQueryOptions
      ) as Observable<Stake[]>
    } else {
      query = gql`query ProposalStakesSearch
        {
          proposalStakes ${createGraphQlQuery(options, where)} {
              ...StakeFields
          }
        }
        ${Stake.fragments.StakeFields}
      `

      return context.getObservableList(
        query,
        itemMap,
        apolloQueryOptions
      ) as Observable<Stake[]>
    }
  }

  public id: string|undefined
  public staticState: IStakeStaticState|undefined

  constructor(
      idOrOpts: string|IStakeStaticState,
      public context: Arc
  ) {
    if (typeof idOrOpts === 'string') {
      this.id = idOrOpts
    } else {
      this.id = idOrOpts.id
      this.setStaticState(idOrOpts as IStakeStaticState)
    }
  }

  public state(apolloQueryOptions: IApolloQueryOptions = {}): Observable<IStakeState> {
    const query = gql`query StakeState
      {
        proposalStake (id: "${this.id}") {
          id
          createdAt
          staker
          proposal {
            id
          }
          outcome
          amount
        }
      }
    `

    const itemMap = (item: any): IStakeState => {
      if (item === null) {
        throw Error(`Could not find a Stake with id ${this.id}`)
      }
      this.setStaticState({
        amount: item.reputation,
        createdAt: item.createdAt,
        id: item.id,
        outcome: item.outcome,
        proposal: item.proposal.id,
        staker: item.staker
      })
      return {
        amount: item.reputation,
        createdAt: item.createdAt,
        id: item.id,
        outcome: item.outcome,
        proposal: item.proposal.id,
        staker: item.staker
      }
    }
    return this.context.getObservableObject(query, itemMap, apolloQueryOptions)
  }

  public setStaticState(opts: IStakeStaticState) {
    this.staticState = opts
  }

  public async fetchStaticState(): Promise<IStakeStaticState> {
    if (!!this.staticState) {
      return this.staticState
    } else {
      const state = await this.state({subscribe: false}).pipe(first()).toPromise()
      this.setStaticState(state)
      return state
    }
  }

}
