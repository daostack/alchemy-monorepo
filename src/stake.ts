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
      (r: any) => new Stake(r.id, r.staker.id, r.createdAt, r.outcome, r.amount, r.proposal.id),
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
