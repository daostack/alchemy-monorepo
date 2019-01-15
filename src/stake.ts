import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc } from './arc'
import { Proposal, ProposalOutcome} from './proposal'
import { Address, ICommonQueryOptions } from './types'

export interface IStakeQueryOptions extends ICommonQueryOptions {
  proposalId?: string
  [key: string]: any
}

export interface IStake {
  staker: Address
  outcome: ProposalOutcome
  amount: number // amount staked
  proposal: Proposal
  createdAt: Date
}

export class Stake implements IStake {
  public static search(context: Arc, options: IStakeQueryOptions = {}): Observable<IStake[]> {
    let where = ''
    let daoFilter: (r: any) => boolean
    daoFilter = (r: any) => true

    for (const key of Object.keys(options)) {
      if (key === 'dao') {
        // TODO: next line filters bu DAO, which is a sort of hack we can use if  we need This
        // before https://github.com/daostack/subgraph/issues/65 is resolved
        daoFilter = (r: any) => r[0].member.dao.id === options.dao
      } else if (options[key] !== undefined) {
        where += `${key}: "${options[key] as string}",\n`
      }
    }

    const query = gql`
      {
        proposalStakes (where: {
          ${where}
        }) {
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
    return context._getObservableListWithFilter(
      query,
      (r: any) => new Stake(r.id, r.staker.id, r.createdAt, r.outcome, r.amount, r.prposal.id, context),
      daoFilter
    ) as Observable<IStake[]>
  }

  public proposal: Proposal

  constructor(
      public id: string,
      public staker: string,
      public createdAt: Date,
      public outcome: ProposalOutcome,
      public amount: number,
      public proposalId: string,
      public context: Arc
  ) {
    this.proposal = new Proposal(proposalId, this.context)
  }
}
