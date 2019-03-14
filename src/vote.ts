import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { IProposalOutcome } from './proposal'
import { Address, Date, ICommonQueryOptions } from './types'

export interface IVote {
  id: string|undefined
  voter: Address
  createdAt: Date | undefined
  outcome: IProposalOutcome
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
    options: IVoteQueryOptions = {},
    context: Arc,
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable <IVote[]> {
    let where = ''
    let daoFilter: (r: any) => boolean
    daoFilter = () => true

    for (const key of Object.keys(options)) {
      if (key === 'voter') {
        options[key] = (options[key] as string).toLowerCase()
      }
      where += `${key}: "${options[key] as string}"\n`
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
        let outcome: IProposalOutcome = IProposalOutcome.Pass
        if (r.outcome === 'Pass') {
          outcome = IProposalOutcome.Pass
        } else if (r.outcome === 'Fail') {
          outcome = IProposalOutcome.Fail
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
      public outcome: IProposalOutcome,
      public amount: BN,
      public proposalId: string,
      public dao: Address
  ) {}
}
