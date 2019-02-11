import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { Arc } from './arc'
import { DAO } from './dao'

import { IProposalQueryOptions, Proposal } from './proposal'
import { Reward } from './reward'
import { IStake, IStakeQueryOptions } from './stake'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { IVote, IVoteQueryOptions, Vote } from './vote'

export interface IMemberState {
  address: Address
  dao: DAO,
  // TODO: include ETH balance
  // eth: number
  reputation: number
  // 'tokens' --> balance of address in dao.nativeToken.balanceOf
  tokens: number
}

/**
 * Represents a user of a DAO
 */

export class Member implements IStateful<IMemberState> {
  public state: Observable<IMemberState>

  /**
   * @param address addresssof the member
   * @param daoAdress addresssof the DAO this member is a member of
   * @param context an instance of Arc
   */
  constructor(public address: Address, public daoAddress: Address, public context: Arc) {
    const query = gql`
      {
        members (
          where: {
            address: "${address}"
            dao: "${daoAddress}"
          }
        ) {
          id
          address
          dao {
            id
          }
          reputation
          tokens
        }
      }
    `

    const itemMap = (items: any) => {
      if (items.length === 0) {
        // TODO: we did not find the member, so we know the reputation is 0
        // however, this account may still posess some tokens, so we shoudl not assume that tokens: 0
        // Probably best to solve by also adding tokenholders to he member collection in the subgraph
        return {
          address,
          dao: new DAO(daoAddress, this.context),
          reputation: 0,
          tokens: 0
        }
      } else {
        const item = items[0]
        return {
          address,
          dao: new DAO(daoAddress, this.context),
          reputation: Number(item.reputation),
          tokens: Number(item.tokens)
        }
      }
    }

    this.state = context._getObservableObject(query, itemMap) as Observable<IMemberState>

  }

  public dao(): DAO {
    return new DAO(this.daoAddress, this.context)
  }

  public rewards(): Observable<Reward[]> {
    throw new Error('not implemented')
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
    options.proposer = this.address
    return this.dao().proposals(options)
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    options.staker = this.address
    return this.dao().stakes(options)
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    throw new Error('not implemented')
    // TODO: implementation is pending https://github.com/daostack/subgraph/issues/96
    // options.voter = this.address
    // return Vote.search(this.context, options)
  }
}

export interface IMemberQueryOptions extends ICommonQueryOptions {
  address?: Address
  dao?: Address
}
