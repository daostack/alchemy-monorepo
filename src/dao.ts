import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc } from './arc'
import { IMemberQueryOptions, Member } from './member'
import {
  IProposalCreateOptions,
  IProposalQueryOptions,
  Proposal,
  ProposalStage
} from './proposal'
import { Reputation } from './reputation'
import { IRewardQueryOptions, IRewardState, Reward } from './reward'
import { IStake, IStakeQueryOptions, Stake } from './stake'
import { Token } from './token'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { getWeb3Options } from './utils'
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
    this.state = this.context._getObservableObject(query, 'dao', itemMap) as Observable<IDAOState>
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
    // TODO: there must be  better way to construct a where clause from a dictionary
    let where = ''
    for (const key of Object.keys(options)) {
      if (key === 'stage' && options[key] !== undefined) {
        where += `${key}: ${ProposalStage[options[key] as ProposalStage]},\n`
      } else {
        where += `${key}: "${options[key] as string}",`
      }
    }

    const query = gql`
      {
        proposals(where: {
          ${where}
          dao: "${this.address}"
        }) {
          id
        }
      }
    `

    return this.context._getObservableList(
      query,
      (r: any) => new Proposal(r.id, this.address, this.context)
    ) as Observable<Proposal[]>
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

  public getContract(name: string) {
    // TODO: we are taking the default contracts from the migration repo adn assume
    // that they are the ones used by the current DAO. This assumption is only valid
    // on our controlled test environment. Should get the correct contracts instead
    const opts = getWeb3Options(this.context.web3)
    const addresses = this.context.contractAddresses
    let contractClass
    let contract
    switch (name) {
      case 'AbsoluteVote':
        contractClass = require('@daostack/arc/build/contracts/AbsoluteVote.json')
        contract = new this.context.web3.eth.Contract(contractClass.abi, addresses.AbsoluteVote, opts)
        return contract
      case 'ContributionReward':
        contractClass = require('@daostack/arc/build/contracts/ContributionReward.json')
        contract = new this.context.web3.eth.Contract(contractClass.abi, addresses.ContributionReward, opts)
        return contract
      case 'GenesisProtocol':
        contractClass = require('@daostack/arc/build/contracts/GenesisProtocol.json')
        contract = new this.context.web3.eth.Contract(contractClass.abi, addresses.GenesisProtocol, opts)
        return contract
      default:
        throw Error(`Unknown contract: ${name}`)
    }
  }
}

export interface IDAOQueryOptions extends ICommonQueryOptions {
  address?: Address
  name?: string
}
