import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { IProposalOutcome } from './proposal'
import { Address, Date, ICommonQueryOptions } from './types'
import { BN, createGraphQlQuery, isAddress } from './utils'

export interface IVote {
  id: string|undefined
  voter: Address
  createdAt: Date | undefined
  outcome: IProposalOutcome
  amount: typeof BN // amount of reputation that was voted with
  proposalId: string
  dao: Address
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

export class Vote implements IVote {

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
        return new Vote(r.id, r.voter, r.createdAt, outcome, new BN(r.reputation || 0), r.proposal.id, r.dao.id)
      },
      daoFilter,
      apolloQueryOptions
    ) as Observable<Vote[]>
  }

  constructor(
      public id: string|undefined,
      public voter: Address,
      public createdAt: Date | undefined,
      public outcome: IProposalOutcome,
      public amount: typeof BN,
      public proposalId: string,
      public dao: Address
  ) {}
}
