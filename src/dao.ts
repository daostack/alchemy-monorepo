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
import { Reputation } from './reputation'
import { IRewardQueryOptions, IRewardState, Reward } from './reward'
import { IStake, IStakeQueryOptions, Stake } from './stake'
import { Token } from './token'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { IVote, IVoteQueryOptions, Vote } from './vote'

const Web3 = require('web3')

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
  externalTokenAddress: Address | undefined,
  externalTokenBalance: BN | undefined,
  externalTokenSymbol: string | undefined
  // TODO: get Eth balance once https://github.com/daostack/subgraph/issues/62 is resolved
  // ethBalance: BN
}

export class DAO implements IStateful<IDAOState> {
  public state: Observable<IDAOState>

  constructor(public address: Address, public context: Arc) {

    this.address = address.toLowerCase()

    const query = gql`{
      dao(id: "${this.address}") {
        id
        name,
        nativeReputation { id, totalSupply },
        nativeToken { id, name, symbol, totalSupply },
        membersCount
      }
    }`

    const itemMap = (item: any): IDAOState => {
      if (item === null) {
        throw Error(`Could not find a DAO with address ${this.address}`)
      }
      return {
        address: item.id,
        // ethBalance: new BN(100),
        externalTokenAddress: undefined,
        // TODO: get external token balance, cf. https://github.com/daostack/subgraph/issues/62
        externalTokenBalance: undefined,
        externalTokenSymbol: undefined,
        memberCount: Number(item.membersCount),
        name: item.name,
        reputation: new Reputation(item.nativeReputation.id, context),
        reputationTotalSupply: new BN(item.nativeReputation.totalSupply),
        token: new Token(item.nativeToken.id, context),
        // TODO: get native token balance, cf. https://github.com/daostack/subgraph/issues/62
        tokenBalance: new BN(100),
        tokenName: item.nativeToken.name,
        tokenSymbol: item.nativeToken.symbol,
        tokenTotalSupply: item.nativeToken.totalSupply
      }
    }
    this.state = this.context._getObservableObject(query, itemMap) as Observable<IDAOState>
  }

  /*
   * return the nativeReputation of the DAO
   * @returns an (Observable) that returns a Reputation instance
   */
  public nativeReputation(): Observable<Reputation> {
    return this.state.pipe(first()).pipe(map((r) => r.reputation))
  }

  public members(options: IMemberQueryOptions = {}): Observable<Member[]> {
    const query = gql`{
      members (where: { dao: "${this.address}"}){
        id
        address
      }
    }`
    const itemMap = (item: any): Member => new Member(item.address, this.address, this.context)
    return this.context._getObservableList(query, itemMap) as Observable<Member[]>
  }

  public member(address: Address): Member {
    return new Member(address, this.address, this.context)
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
    options.dao = this.address
    return Proposal.search(options, this.context)

  }

  public proposal(id: string): Proposal {
    return new Proposal(id, this.address, this.context)
  }

  public createProposal(options: IProposalCreateOptions) {
    options.dao = this.address
    return Proposal.create(options, this.context)
  }

  public rewards(options: IRewardQueryOptions = {}): Observable<IRewardState[]> {
    options.dao = this.address
    return Reward.search(this.context, options)
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    options.dao = this.address
    return Vote.search(this.context, options)
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    options.dao = this.address
    return Stake.search(this.context, options)
  }

  public ethBalance(): Observable<BN> {
    return this.context.getBalance(this.address)
  }
}

export interface IDAOQueryOptions extends ICommonQueryOptions {
  address?: Address
  name?: string
}
