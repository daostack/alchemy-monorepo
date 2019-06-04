import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { IProposalOutcome} from './proposal'
import { Address, ICommonQueryOptions } from './types'
import { BN, isAddress } from './utils'

export interface IStake {
  id: string|undefined
  staker: Address
  createdAt: Date | undefined
  outcome: IProposalOutcome
  amount: typeof BN // amount staked
  proposalId: string
}

export interface IStakeQueryOptions extends ICommonQueryOptions {
  id?: string
  staker?: Address
  dao?: Address
  proposal?: string
  createdAt?: number
  [key: string]: any
}

export class Stake implements IStake {

  /**
   * Stake.search(context, options) searches for stake entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. IStakeQueryOptions
   * @return         an observable of Stake objects
   */
  public static search(
    context: Arc,
    options: IStakeQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable <Stake[]> {

    let where = ''
    for (const key of Object.keys(options)) {
      if (options[key] === undefined) {
        continue
      }

      if (key === 'staker' || key === 'dao') {
        const option = options[key] as string
        isAddress(option)
        options[key] = option.toLowerCase()
      }

      where += `${key}: "${options[key] as string}"\n`
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

    return context.getObservableList(
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
    ) as Observable<Stake[]>
  }

  constructor(
      public id: string|undefined,
      public staker: string,
      public createdAt: Date | undefined,
      public outcome: IProposalOutcome,
      public amount: typeof BN,
      public proposalId: string
      // public dao: Address
  ) {
  }
}
