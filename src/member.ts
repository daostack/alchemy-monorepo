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
   * @param id Id of the member
   * @param context an instance of Arc
   */
  constructor(public id: string, public context: Arc) {
    const query = gql`
      {
        member (id: "${id}") {
          id,
          address,
          dao {
            id
          },
          reputation,
          tokens,
        }
      }
    `

    const itemMap = (item: any) => {
      if (item === null) {
        throw Error(`Could not find a Member with id '${id}'`)
      }

      return {
        address: item.address,
        dao: new DAO(item.dao.id, this.context),
        id: item.id,
        reputation: Number(item.reputation),
        tokens: Number(item.tokens)
      }
    }

    this.state = context._getObservableObject(query, 'member', itemMap) as Observable<IMemberState>

  }

  public dao(): Observable<DAO> {
    return this.state.pipe(
      map((state) => {
        return state.dao
      })
    )
  }

  public rewards(): Observable<Reward[]> {
    throw new Error('not implemented')
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
    return this.dao().pipe(
      switchMap((dao) => {
        options.proposer = this.id
        return dao.proposals(options)
    }))
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    throw new Error('not implemented')
    // const dao = new DAO(this.dao)
    // return dao.stakes(options)
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    options.member = this.id
    return Vote.search(this.context, options)
  }
}

export interface IMemberQueryOptions extends ICommonQueryOptions {
  address?: Address
  dao?: Address
}
