import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { IProposalOutcome } from './proposal'
import { Address, Date, ICommonQueryOptions } from './types'
import { BN, createGraphQlQuery, isAddress } from './utils'

export interface IVoteStaticState {
  id?: string
  voter: Address
  createdAt: Date | undefined
  outcome: IProposalOutcome
  amount: typeof BN // amount of reputation that was voted with
  proposal: string
  dao: Address
}

// @ts-ignore
export interface IVoteState extends IVoteStaticState {

}
export interface IVoteQueryOptions extends ICommonQueryOptions {
  where?: {
    id?: string
    voter?: Address
    outcome?: IProposalOutcome
    proposal?: string
    dao?: Address
    [key: string]: any
  }
}

export class Vote {

  /**
   * Vote.search(context, options) searches for vote entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. IVoteQueryOptions
   * @return         an observable of Vote objects
   */
  public static search(
    context: Arc,
    options: IVoteQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable <Vote[]> {
    if (!options.where) { options.where = {}}
    let where = ''
    let daoFilter: (r: any) => boolean
    daoFilter = () => true

    for (const key of Object.keys(options.where)) {
      if (options.where[key] === undefined) {
        continue
      }

      if (key === 'voter' || key === 'dao') {
        const option = options.where[key] = options.where[key] as string
        isAddress(option)
        options.where[key] = option.toLowerCase()
      }

      if (key === 'outcome') {
        where += `${key}: "${IProposalOutcome[options.where[key] as number]}"\n`
      } else {
        where += `${key}: "${options.where[key] as string}"\n`
      }
    }

    const query = gql`
      {
        proposalVotes ${createGraphQlQuery(options, where)} {
          id
          createdAt
          dao {
            id
          }
          voter
          proposal {
            id
          }
          outcome
          reputation
        }
      }
    `
    return context.getObservableListWithFilter(
      query,
      (r: any) => {
        let outcome: IProposalOutcome = IProposalOutcome.Pass
        if (r.outcome === 'Pass') {
          outcome = IProposalOutcome.Pass
        } else if (r.outcome === 'Fail') {
          outcome = IProposalOutcome.Fail
        } else {
          throw new Error(`Unexpected value for proposalVote.outcome: ${r.outcome}`)
        }
        return new Vote({
          amount: new BN(r.reputation || 0),
          createdAt: r.createdAt,
          dao: r.dao.id,
          id: r.id,
          outcome,
          proposal: r.proposal.id,
          voter: r.voter
        })
      },
      daoFilter,
      apolloQueryOptions
    ) as Observable<Vote[]>
  }
  public id: string|undefined
  public staticState: IVoteStaticState|undefined

  constructor(idOrOpts: string|IVoteStaticState) {
    if (typeof idOrOpts === 'string') {
      this.id = idOrOpts
    } else {
      const opts = idOrOpts as IVoteStaticState
      this.id = opts.id
      this.setStaticState(opts)
    }
  }

  public setStaticState(opts: IVoteStaticState) {
    this.staticState = opts
  }
}
