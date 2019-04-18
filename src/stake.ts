import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { IProposalOutcome} from './proposal'
import { Address, ICommonQueryOptions } from './types'

export interface IStake {
  id: string|undefined
  staker: Address
  createdAt: Date | undefined
  outcome: IProposalOutcome
  amount: BN // amount staked
  proposalId: string
  // dao: Address
}

export interface IStakeQueryOptions extends ICommonQueryOptions {
  proposal?: string
  staker?: Address
  createdAt?: number
  [id: string]: any
}

export class Stake implements IStake {
  public static search(
    options: IStakeQueryOptions = {},
    context: Arc,
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable <IStake[]> {

    let where = ''
    for (const key of Object.keys(options)) {
      if (options[key] !== undefined) {
        if (key === 'staker') {
          options[key] = (options[key] as string).toLowerCase()
        }
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

    return context._getObservableList(
      query,
      (r: any) => {
        let outcome: IProposalOutcome = IProposalOutcome.Pass
        if (r.outcome === 'Pass') {
          outcome = IProposalOutcome.Pass
        } else if (r.outcome === 'Fail') {
          outcome = IProposalOutcome.Fail
        } else {
          throw new Error(`Unexpected value for proposalStakes.outcome: ${r.outcome}`)
        }
        return new Stake(r.id, r.staker, r.createdAt, outcome, new BN(r.amount || 0), r.proposal.id)
      },
      apolloQueryOptions
    ) as Observable<IStake[]>
  }

  constructor(
      public id: string|undefined,
      public staker: string,
      public createdAt: Date | undefined,
      public outcome: IProposalOutcome,
      public amount: BN,
      public proposalId: string
      // public dao: Address
  ) {
  }
}
