import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Arc } from './arc'
import { Proposal } from './proposal'
import { Address, ICommonQueryOptions, IStateful } from './types'

export enum RewardType {
  Reputation,
  Token,
  ETH,
  External
}

export enum RewardReason {
  Contribution,
  Proposer,
  Voter,
  Staker,
  Bounty
}

export interface IRewardState {
  id: string
  beneficiary: Address
  createdAt: Date
  proposalId: string,
  reputationForVoter: BN,
  tokensForStaker: BN,
  daoBountyForStaker: BN,
  reputationForProposer: BN,
  tokenAddress: Address,
  redeemedReputationForVoter: BN,
  redeemedTokensForStaker: BN,
  redeemedReputationForProposer: BN,
  redeemedDaoBountyForStaker: BN

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
  public static search(context: Arc, options: IRewardQueryOptions): Observable<IRewardState[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      if (where !== '') { where += ',\n'}
      where += `${key}: "${options[key] as string}"`
    }

    const query = gql`{
      gprewards (where: {${where}}) {
        id
        createdAt
        dao {
          id
        }
        beneficiary
        proposal {
           id
        }
        reputationForVoter
        tokensForStaker
        daoBountyForStaker
        reputationForProposer
        tokenAddress
        redeemedReputationForVoter
        redeemedTokensForStaker
        redeemedReputationForProposer
        redeemedDaoBountyForStaker
      }
    } `

    const itemMap = (item: any): IRewardState => {
      return {
        beneficiary: item.beneficiary,
        createdAt: item.createdAt,
        daoBountyForStaker: new BN(item.daoBountyForStaker),
        id: item.id,
        // proposal: new Proposal(item.proposal.id, item.dao.id, context),
        proposalId: item.proposal.id,
        redeemedDaoBountyForStaker: new BN(item.redeemedDaoBountyForStaker),
        redeemedReputationForProposer: new BN(item.redeemedReputationForProposer),
        redeemedReputationForVoter: new BN(item.redeemedReputationForVoter),
        redeemedTokensForStaker: new BN(item.redeemedTokensForStaker),
        reputationForProposer: new BN(item.reputationForProposer),
        reputationForVoter: new BN(item.reputationForVoter),
        tokenAddress: item.tokenAddress,
        tokensForStaker: new BN(item.tokensForStaker)
      }
    }

    return context._getObservableList(query, itemMap) as Observable<IRewardState[]>
  }

  public state: Observable<IRewardState> = of()

  constructor(public id: string, public context: Arc) {
    this.id = id
    this.context = context
    this.state = Reward.search(this.context, {id: this.id}).pipe(
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
