import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import { Arc } from './arc'
import { IMemberQueryOptions, Member } from './member'
import {
  IProposalCreateOptions,
  IProposalQueryOptions,
  IStake,
  IStakeQueryOptions,
  IVoteQueryOptions,
  Proposal,
  ProposalStage
} from './proposal'
import { Reputation } from './reputation'
import { IRewardQueryOptions, Reward } from './reward'
import { Token } from './token'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { IVote, Vote } from './vote'

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
        members { id },
        name,
        nativeReputation { id, totalSupply },
        nativeToken { id, name, symbol, totalSupply },
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
        // TODO: getting all members is not really scaleable - we need a way ot get the member count
        // from the subgraph
        memberCount: item.members.length,
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
      (r: any) => new Proposal(r.id, this.context)
    ) as Observable<Proposal[]>
  }

  public proposal(id: string): Proposal {
    return new Proposal(id, this.context)
  }

  public createProposal(options: IProposalCreateOptions) {
    options.dao = this.address
    return Proposal.create(options, this.context)
  }

  public rewards(options: IRewardQueryOptions = {}): Observable<Reward[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      where += `${key}: "${options[key] as string}",\n`
    }

    const query = gql`
      {
        rewards (where: {
          ${where}
          dao: "${this.address}"
        }) {
          id
        }
      }
    `

    return this.context._getObservableList(
      query,
      (r: any) => new Reward(r.id, this.context)
    ) as Observable<Reward[]>
  }

  public votes(options: IVoteQueryOptions = {}): Observable < IVote[] > {
    let where = ''
    for (const key of Object.keys(options)) {
      where += `${key}: "${options[key] as string}",\n`
    }

    const query = gql`
      {
        proposalVotes(where: {
          ${where}
        }) {
          id
          createdAt
          member {
            id
            dao {
              id
            }
          }
          proposal {
            id
          }
          outcome
          reputation
        }
      }
    `
    return this.context._getObservableListWithFilter(
      query,
      (r: any) => new Vote(r.id, r.member.id, r.createdAt, r.outcome, r.reputation, r.proposal.id,  r.member.dao.id),
      (r: any) => r[0].member.dao.id === this.address
    ) as Observable<IVote[]>
  }

  public stakes(options: IStakeQueryOptions = {}): Observable < IStake[] > {
    throw new Error('not implemented')
  }
}

export interface IDAOQueryOptions extends ICommonQueryOptions {
  address?: Address
  name?: string
}
