import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { ProposalOutcome} from './proposal'
import { Address, ICommonQueryOptions } from './types'

export interface IStake {
  id: string
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

    let where = ''
    let daoFilter: (r: any) => boolean
    daoFilter = () => true

    for (const key of Object.keys(options)) {
      if (options.dao) {
        // TODO: we ignore the options.dao argument while waiting for https://github.com/daostack/subgraph/issues/65
      } else {
        where += `${key}: "${options[key] as string}"\n`
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
      (r: any) => new Stake(r.id, r.staker.id, r.createdAt, r.outcome, Number(r.amount), r.proposal.id),
      daoFilter,
      apolloQueryOptions
    ) as Observable<IStake[]>
  }

  constructor(
      public id: string,
      public staker: string,
      public createdAt: Date | undefined,
      public outcome: ProposalOutcome,
      public amount: number,
      public proposalId: string
      // public dao: Address
  ) {
  }
}
