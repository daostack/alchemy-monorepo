import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Arc } from './arc'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { BN } from './utils'
import { isAddress } from './utils'

export interface IRewardState {
  id: string
  beneficiary: Address
  createdAt: Date
  proposalId: string,
  reputationForVoter: typeof BN,
  tokensForStaker: typeof BN,
  daoBountyForStaker: typeof BN,
  reputationForProposer: typeof BN,
  tokenAddress: Address,
  reputationForVoterRedeemedAt: typeof BN,
  tokensForStakerRedeemedAt: typeof BN,
  reputationForProposerRedeemedAt: typeof BN,
  daoBountyForStakerRedeemedAt: typeof BN
}

export interface IRewardQueryOptions extends ICommonQueryOptions {
  proposal?: string
  // TODO: beneficiary is not a field on Reward - see issue https://github.com/daostack/subgraph/issues/60
  // beneficiary?: Address
  createdAtAfter?: Date
  createdAtBefore?: Date
  [id: string]: any
}

export class Reward implements IStateful<IRewardState> {

  // TODO: Reward.search returns a list of IRewardState instances (not Reward instances)
  // this is much more conveient client side, but the behavior is not consistent with the other `serach` implementations
  /**
   * Reward.search(context, options) searches for reward entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. IRewardQueryOptions
   * @return         an observable of IRewardState objects
   */
  public static search(options: IRewardQueryOptions, context: Arc): Observable<IRewardState[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      if (options[key] !== undefined) {
        if (key === 'beneficiary') {
          isAddress(options[key])
          options[key] = options[key].toLowerCase()
        }
        where += `${key}: "${options[key] as string}"\n`
      }
    }

    const query = gql`{
      gprewards (where: {${where}}) {
        id
        createdAt
        dao {
          id
        }
        beneficiary
        daoBountyForStaker
        proposal {
           id
        }
        reputationForVoter
        reputationForVoterRedeemedAt
        reputationForProposer
        reputationForProposerRedeemedAt
        tokenAddress
        tokensForStaker
        tokensForStakerRedeemedAt
        daoBountyForStakerRedeemedAt
      }
    } `

    const itemMap = (item: any): IRewardState => {
      return {
        beneficiary: item.beneficiary,
        createdAt: item.createdAt,
        daoBountyForStaker: new BN(item.daoBountyForStaker),
        daoBountyForStakerRedeemedAt: new BN(item.daoBountyForStakerRedeemedAt),
        id: item.id,
        // proposal: new Proposal(item.proposal.id, item.dao.id, context),
        proposalId: item.proposal.id,
        reputationForProposer: new BN(item.reputationForProposer),
        reputationForProposerRedeemedAt: new BN(item.reputationForProposerRedeemedAt),
        reputationForVoter: new BN(item.reputationForVoter),
        reputationForVoterRedeemedAt: new BN(item.reputationForVoterRedeemedAt),
        tokenAddress: item.tokenAddress,
        tokensForStaker: new BN(item.tokensForStaker),
        tokensForStakerRedeemedAt: new BN(item.tokensForStakerRedeemedAt)
      }
    }

    return context.getObservableList(query, itemMap) as Observable<IRewardState[]>
  }

  constructor(public id: string, public context: Arc) {
    this.id = id
    this.context = context
  }

  public state(): Observable<IRewardState> {
    return Reward.search({id: this.id}, this.context).pipe(
      map((rewards) => {
        if (rewards.length === 0) {
          throw Error(`No reward with id ${this.id} found`)
        } else if (rewards.length > 1) {
          throw Error(`This should never happen`)
        } else {
          return rewards[0]
        }
      })
    )
  }
}
