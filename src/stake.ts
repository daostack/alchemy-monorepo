import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { ProposalOutcome} from './proposal'
import { Address, ICommonQueryOptions } from './types'
import { whereClause } from './utils'

export interface IStake {
  id: string|undefined
  staker: Address
  createdAt: Date | undefined
  outcome: ProposalOutcome
  amount: number // amount staked
  proposalId: string
  // dao: Address
}

export interface IStakeQueryOptions extends ICommonQueryOptions {
  proposalId?: string
  [key: string]: any
}

export class Stake implements IStake {
  public static search(
    context: Arc,
    options: IStakeQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable <IStake[]> {

    // TODO: we ignore the options.dao argument while waiting for https://github.com/daostack/subgraph/issues/65
    options.dao = undefined

    const query = gql`
      {
        proposalStakes (where: {
          ${whereClause(options)}
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
    return context._getObservableList(
      query,
      (r: any) => new Stake(r.id, r.staker, r.createdAt, r.outcome, Number(r.amount), r.proposal.id),
      apolloQueryOptions
    ) as Observable<IStake[]>
  }

  constructor(
      public id: string|undefined,
      public staker: string,
      public createdAt: Date | undefined,
      public outcome: ProposalOutcome,
      public amount: number,
      public proposalId: string
      // public dao: Address
  ) {
  }
}
