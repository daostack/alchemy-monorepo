import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { ProposalOutcome } from './proposal'
import { Address, Date, ICommonQueryOptions } from './types'

export interface IVote {
  id: string|undefined
  voter: string
  createdAt: Date | undefined
  outcome: ProposalOutcome
  amount: number // amount of reputation that was voted with
  proposalId: string
  dao: Address
}

export interface IVoteQueryOptions extends ICommonQueryOptions {
  voter?: Address
  proposal?: string
  dao?: Address
  [key: string]: any
}

export class Vote implements IVote {

  public static search(
    context: Arc,
    options: IVoteQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable <IVote[]> {
    let where = ''
    let daoFilter: (r: any) => boolean
    daoFilter = () => true

    for (const key of Object.keys(options)) {
      if (key === 'dao') {
        // TODO: next line filters bu DAO, which is a sort of hack we can use if  we need This
        // before https://github.com/daostack/subgraph/issues/65 is resolved
        daoFilter = (r: any) => {
          if (r.length > 0) {
            return r[0].member.dao.id === options.dao
          } else {
            return false
          }
        }
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
      (r: any) => {
        let outcome: ProposalOutcome = ProposalOutcome.Pass
        if (r.outcome === 'Pass') {
          outcome = ProposalOutcome.Pass
        } else if (r.outcome === 'Fail') {
          outcome = ProposalOutcome.Fail
        } else {
          throw new Error(`Unexpected value for proposalVote.outcome: ${r.outcome}`)
        }
        return new Vote(r.id, r.member.id, r.createdAt, outcome, r.reputation, r.proposal.id,  r.member.dao.id)
      },
      daoFilter,
      apolloQueryOptions
    ) as Observable<IVote[]>
  }

  constructor(
      public id: string|undefined,
      public voter: string,
      public createdAt: Date | undefined,
      public outcome: ProposalOutcome,
      public amount: number,
      public proposalId: string,
      public dao: Address
  ) {}
}
