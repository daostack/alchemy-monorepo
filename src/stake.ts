import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { IProposalOutcome} from './proposal'
import { Address, ICommonQueryOptions } from './types'
import { BN, createGraphQlQuery, isAddress } from './utils'

export interface IStakeStaticState {
  id?: string
  staker: Address
  createdAt: Date | undefined
  outcome: IProposalOutcome
  amount: typeof BN // amount staked
  proposal: string
}

// @ts-ignore
export interface IStakeState extends IStakeStaticState {

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

export class Stake {

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

    const query = gql`
      {
        proposalStakes ${createGraphQlQuery(options, where)} {
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

    return context.getObservableList(
      query,
      (r: any) => {
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
        })
      },
      apolloQueryOptions
    ) as Observable<Stake[]>
  }

  public id: string|undefined
  public staticState: IStakeStaticState|undefined

  constructor(
      idOrOpts: string|IStakeStaticState
  ) {
    if (typeof idOrOpts === 'string') {
      this.id = idOrOpts
    } else {
      this.id = idOrOpts.id
      this.setStaticState(idOrOpts as IStakeStaticState)
    }
  }

  public setStaticState(opts: IStakeStaticState) {
    this.staticState = opts
  }
}
