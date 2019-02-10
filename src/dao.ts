import gql from 'graphql-tag'
import { Observable } from 'rxjs'
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
  reputationTotalSupply: number,
  token: Token,
  tokenBalance: number,
  tokenName: string,
  tokenSymbol: string,
  tokenTotalSupply: number,
  externalTokenAddress: Address,
  externalTokenBalance: number
  externalTokenSymbol: string,
  ethBalance: number
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
        // TODO: get Eth balance, cf https://github.com/daostack/subgraph/issues/62
        ethBalance: 314159265359,
        externalTokenAddress: '',
        // TODO: get external token balance, cf. https://github.com/daostack/subgraph/issues/62
        externalTokenBalance: 314159265359,
        externalTokenSymbol: '',
        memberCount: Number(item.membersCount),
        name: item.name,
        reputation: new Reputation(item.nativeReputation.id, context),
        reputationTotalSupply: item.nativeReputation.totalSupply,
        token: new Token(item.nativeToken.id, context),
        // TODO: get external token balance, cf. https://github.com/daostack/subgraph/issues/62
        tokenBalance: 314159265359,
        tokenName: item.nativeToken.name,
        tokenSymbol: item.nativeToken.symbol,
        tokenTotalSupply: item.nativeToken.totalSupply
      }
    }
    this.state = this.context._getObservableObject(query, itemMap) as Observable<IDAOState>
  }

  public members(options: IMemberQueryOptions = {}): Observable<Member[]> {
    // TODO: show only members from this DAO
    const query = gql`{
      members (where: { dao: "${this.address}"}){
        id
      }
    }`
    const itemMap = (item: any): Member => new Member(item.id, this.context)
    return this.context._getObservableList(query, itemMap) as Observable<Member[]>
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

  public ethBalance(): Observable<number> {
    return this.context.getBalance(this.address)
  }

  public allowance(address: string): Observable<any[]> {
    const genesisProtocol = this.context.getContract('GenesisProtocol')
    const query = gql`{
      allowances (where {
        owner: "${address}"
        spender: "${genesisProtocol}"
      }){
        id
        owner {
          id
        }
        spender
        amount
      }
    }`
    return this.context._getObservableList(query)
  }

}

export interface IDAOQueryOptions extends ICommonQueryOptions {
  address?: Address
  name?: string
}
