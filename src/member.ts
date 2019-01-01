import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { Arc } from './arc'

import {
  IProposalQueryOptions,
  IStake,
  IStakeQueryOptions,
  IVote,
  IVoteQueryOptions,
  Proposal
} from './proposal'
import { Reward } from './reward'
import { Address, ICommonQueryOptions, IStateful } from './types'

export interface IMemberState {
  address: Address
  dao: string
  eth: number
  reputation: number
  tokens: number
  gen: number
  approvedGen: number
}

/**
 * Represents a user of a DAO
 */

export class Member implements IStateful<IMemberState> {
  public state: Observable<IMemberState>

  /**
   * [constructor description]
   * @param address address of the user
   * @param dao     address of the DAO
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
          reputation
        }
      }
    `

    const itemMap = (item: any) => {
      if (item === null) {
        throw Error(`Could not find a Member with id '${id}'`)
      }

      return {
        address: item.address,
        id: item.id,
        reputation: item.reputation
      }
    }

    this.state = context._getObservableObject(query, 'member', itemMap) as Observable<IMemberState>

  }

  public rewards(): Observable<Reward[]> {
    throw new Error('not implemented')
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
    throw new Error('not implemented')
    // const dao = new DAO(this.dao)
    // return dao.proposals(options)
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    throw new Error('not implemented')
    // const dao = new DAO(this.dao)
    // return dao.stakes(options)
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    throw new Error('not implemented')
    // const dao = new DAO(this.dao)
    // return dao.votes(options)
  }
}

export interface IMemberQueryOptions extends ICommonQueryOptions {
  address?: Address
  dao?: Address
}
