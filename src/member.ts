import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { DAO } from './dao'
import { BN } from './utils'

import { IProposalQueryOptions, Proposal } from './proposal'
import { Reward } from './reward'
import { IStake, IStakeQueryOptions } from './stake'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { isAddress } from './utils'
import { IVote, IVoteQueryOptions, Vote } from './vote'

export interface IMemberState {
  address: Address
  dao: DAO,
  reputation: typeof BN
}

/**
 * Represents an account that holds reputaion in a specific DAO
 */

export class Member implements IStateful<IMemberState> {
  public static search(
    options: IMemberQueryOptions,
    context: Arc,
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Member[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      if (options[key] !== undefined) {
        where += `${key}: "${options[key] as string}"\n`
      }
    }

    const query = gql`{
      reputationHolders (where: {
        ${where}
      }) {
        id
        address
        dao {
          id
        }
      }
    }`

    return context.getObservableList(
      query,
      (r: any) => new Member(r.address, r.dao.id, context),
      apolloQueryOptions
    )
  }

  /**
   * @param address addresssof the member
   * @param daoAdress addresssof the DAO this member is a member of
   * @param context an instance of Arc
   */
  constructor(public address: Address, public daoAddress: Address, public context: Arc) {
    isAddress(address)
    isAddress(daoAddress)
  }

  public state(): Observable<IMemberState> {
    const query = gql`
      {
        reputationHolders (
          where: {
            address: "${this.address}"
            dao: "${this.daoAddress}"
          }
        ) {
          id
          address
          dao {
            id
          }
          balance
        }
      }
    `

    const itemMap = (items: any) => {
      if (items.length === 0) {
        return {
          address: this.address,
          dao: new DAO(this.daoAddress, this.context),
          reputation: new BN(0)
        }
      } else {
        const item = items[0]
        return {
          address: this.address,
          dao: new DAO(this.daoAddress, this.context),
          reputation: new BN(item.balance)
        }
      }
    }

    return this.context.getObservableObject(query, itemMap) as Observable<IMemberState>

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
    options.voter = this.address
    return Vote.search( options, this.context)
  }
}

export interface IMemberQueryOptions extends ICommonQueryOptions {
  address?: Address
  dao?: Address
}
