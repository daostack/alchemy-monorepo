import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { ProposalOutcome } from './proposal'
import { Address, Date, ICommonQueryOptions } from './types'

export interface IVote {
  id: string|undefined
  voter: Address
  createdAt: Date | undefined
  outcome: ProposalOutcome
  amount: BN // amount of reputation that was voted with
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
        // TODO: fix this when https://github.com/daostack/subgraph/issues/65 is resolved
        throw new Error('cannot filter by "dao" yet')
      } else {
        where += `${key}: "${options[key] as string}"\n`
      }
    }

    const query = gql`
      {
        proposalVotes(where: {
          ${where}
        }) {
          id
          createdAt
          voter
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
        return new Vote(r.id, r.voter, r.createdAt, outcome, r.reputation, r.proposal.id, '')
      },
      daoFilter,
      apolloQueryOptions
    ) as Observable<IVote[]>
  }

  constructor(
      public id: string|undefined,
      public voter: Address,
      public createdAt: Date | undefined,
      public outcome: ProposalOutcome,
      public amount: BN,
      public proposalId: string,
      public dao: Address
  ) {}
}
