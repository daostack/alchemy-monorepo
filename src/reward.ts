import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
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
  id?: string
  beneficiary?: Address
  dao?: Address
  proposal?: string
  createdAtAfter?: Date
  createdAtBefore?: Date
  [key: string]: any
}

export class Reward implements IStateful<IRewardState> {

  /**
   * Reward.search(context, options) searches for reward entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. IRewardQueryOptions
   * @return         an observable of Reward objects
   */
  public static search(
    context: Arc,
    options: IRewardQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Reward[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      if (options[key] === undefined) {
        continue
      }

      if (key === 'beneficiary' || key === 'dao') {
        const option = options[key] as string
        isAddress(option)
        options[key] = option.toLowerCase()
      }

      where += `${key}: "${options[key] as string}"\n`
    }

    const query = gql`{
      gprewards (where: {${where}}) {
        id
      }
    }`

    return context.getObservableList(
      query,
      (r: any) => new Reward(r.id, context),
      apolloQueryOptions
    ) as Observable<Reward[]>
  }

  constructor(public id: string, public context: Arc) {
    this.id = id
    this.context = context
  }

  public state(): Observable<IRewardState> {

    const query = gql`{
      gpreward ( id: "${this.id}" )
      {
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
    }`

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

    return this.context.getObservableObject(query, itemMap)
  }

}
