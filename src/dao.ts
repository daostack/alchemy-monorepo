import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { first, map } from 'rxjs/operators'
import { Arc } from './arc'
import { IMemberQueryOptions, Member } from './member'
import {
  IProposalCreateOptions,
  IProposalQueryOptions,
  Proposal
} from './proposal'
import { Queue } from './queue'
import { Reputation } from './reputation'
import { IRewardQueryOptions, IRewardState, Reward } from './reward'
import { IStake, IStakeQueryOptions, Stake } from './stake'
import { Token } from './token'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { NULL_ADDRESS } from './utils'
import { IVote, IVoteQueryOptions, Vote } from './vote'

export interface IDAOState {
  address: Address // address of the avatar
  memberCount: number
  name: string
  reputation: Reputation
  reputationTotalSupply: BN,
  token: Token,
  tokenBalance: BN,
  tokenName: string,
  tokenSymbol: string,
  tokenTotalSupply: BN,
}

export class DAO implements IStateful<IDAOState> {

  constructor(public address: Address, public context: Arc) {
    this.address = address.toLowerCase()
    this.context = context
  }

  public state(): Observable<IDAOState> {
    const query = gql`{
      dao(id: "${this.address}") {
        id
        name
        nativeReputation { id, totalSupply }
        nativeToken { id, name, symbol, totalSupply }
        membersCount
        members (where: {address:"${this.address}"}) {
         tokens
         reputation
        }
      }
    }`

    const itemMap = (item: any): IDAOState => {
      if (item === null) {
        throw Error(`Could not find a DAO with address ${this.address}`)
      }
      return {
        address: item.id,
        memberCount: Number(item.membersCount),
        name: item.name,
        reputation: new Reputation(item.nativeReputation.id, this.context),
        reputationTotalSupply: new BN(item.nativeReputation.totalSupply),
        token: new Token(item.nativeToken.id, this.context),
        tokenBalance: new BN(item.members[0].tokens || 0),
        tokenName: item.nativeToken.name,
        tokenSymbol: item.nativeToken.symbol,
        tokenTotalSupply: item.nativeToken.totalSupply
      }
    }
    return this.context.getObservableObject(query, itemMap)
  }

  /*
   * return the nativeReputation of the DAO
   * @returns an (Observable) that returns a Reputation instance
   */
  public nativeReputation(): Observable<Reputation> {
    return this.state().pipe(first()).pipe(map((r) => r.reputation))
  }

  public queues(options: any = {}): Observable<Queue[]> {
    options.dao = this.address
    return Queue.search(options, this.context)
  }

  public members(options: IMemberQueryOptions = {}): Observable<Member[]> {
    const query = gql`{
      members (where: {
        dao: "${this.address}"
        address_not: "${this.address}"
        address_not: "${NULL_ADDRESS}"
      }){
        id
        address
      }
    }`
    const itemMap = (item: any): Member => new Member(item.address, this.address, this.context)
    return this.context.getObservableList(query, itemMap) as Observable<Member[]>
  }

  public member(address: Address): Member {
    return new Member(address, this.address, this.context)
  }

  public createProposal(options: IProposalCreateOptions) {
    options.dao = this.address
    return Proposal.create(options, this.context)
  }

  public proposal(id: string): Proposal {
    return new Proposal(id, this.address, this.context)
  }

  public proposals(options: IProposalQueryOptions = {}): Observable < Proposal[] > {
    options.dao = this.address
    return Proposal.search(options, this.context)
  }

  public rewards(options: IRewardQueryOptions = {}): Observable < IRewardState[] > {
    options.dao = this.address
    return Reward.search(options, this.context)
  }

  public votes(options: IVoteQueryOptions = {}): Observable < IVote[] > {
    options.dao = this.address
    return Vote.search(options, this.context)
  }

  public stakes(options: IStakeQueryOptions = {}): Observable < IStake[] > {
    options.dao = this.address
    return Stake.search(options, this.context)
  }

  public ethBalance(): Observable < BN > {
    return this.context.ethBalance(this.address)
  }
}

export interface IDAOQueryOptions extends ICommonQueryOptions {
  address?: Address
  name?: string
}
