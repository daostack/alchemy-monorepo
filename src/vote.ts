import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc } from './arc'
import { ProposalOutcome } from './proposal'
import { Address, Date, ICommonQueryOptions } from './types'

export interface IVote {
    id: string
    proposer: string
    createdAt: Date
    outcome: ProposalOutcome
    amount: number // amount of reputation that was voted with
    proposalId: string
    dao: Address
}

export interface IVoteQueryOptions extends ICommonQueryOptions {
  member?: Address
  proposal?: string
  dao?: Address
  [key: string]: any
}

export class Vote implements IVote {

  public static search(context: Arc, options: IVoteQueryOptions = {}): Observable <IVote[]> {
    let where = ''
    let daoFilter: (r: any) => boolean
    daoFilter = (r: any) => true

    for (const key of Object.keys(options)) {
      if (key === 'dao') {
        // TODO: next line filters bu DAO, which is a sort of hack we can use if  we need This
        // before https://github.com/daostack/subgraph/issues/65 is resolved
        daoFilter = (r: any) => r[0].member.dao.id === options.dao
      } else {
        where += `${key}: "${options[key] as string}",\n`
      }
    }

    const query = gql`
      {
        proposalVotes(where: {
          ${where}
        }) {
          id
          createdAt
          member {
            id
            dao {
              id
            }
          }
          proposal {
            id
          }
          outcome
          reputation
        }
      }
    `
    return context._getObservableListWithFilter(
      query,
      (r: any) => new Vote(r.id, r.member.id, r.createdAt, r.outcome, r.reputation, r.proposal.id,  r.member.dao.id),
      daoFilter
    ) as Observable<IVote[]>
  }

  constructor(
      public id: string,
      public proposer: string,
      public createdAt: Date,
      public outcome: ProposalOutcome,
      public amount: number,
      public proposalId: string,
      public dao: Address
  ) {}
}
