import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc } from './arc'
import { IMemberQueryOptions, Member } from './member'
import {
  IProposalQueryOptions,
  IStake,
  IStakeQueryOptions,
  IVote,
  IVoteQueryOptions,
  Proposal,
  ProposalStage
} from './proposal'
import { Reputation } from './reputation'
import { IRewardQueryOptions, Reward } from './reward'
import { Token } from './token'
import { Address, ICommonQueryOptions, IStateful } from './types'

export interface IDAOState {
  address: Address // address of the avatar
  memberCount: number
  name: string
  reputation: Reputation
  reputationTotalSupply: number,
  token: Token,
  tokenName: string,
  tokenSymbol: string,
  tokenTotalSupply: number,
  externalTokenSymbol: string,
  externalTokenAddress: Address
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
        externalTokenAddress: '',
        externalTokenSymbol: '',
        // TODO: getting all members is not really scaleable - we need a way ot get the member count
        // from the subgraph
        memberCount: item.members.length,
        name: item.name,
        reputation: new Reputation(item.nativeReputation.id, context),
        reputationTotalSupply: item.nativeReputation.totalSupply,
        token: new Token(item.nativeToken.id, context),
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
      members {
        id
      }
    }`
    const itemMap = (item: any): Member => new Member(item.id, this.context)
    return this.context._getObservableList(query, 'members', itemMap) as Observable<Member[]>
  }

  public proposals(options: IProposalQueryOptions = {dao: this.address}): Observable<Proposal[]> {

    // TODO: there must be  better way to construct a where clause from a dictionary
    let where = ''
    for (const key of Object.keys(options)) {
      if (key === 'stage' && options[key] !== undefined) {
        where += `${key}: ${ProposalStage[options[key] as ProposalStage]},\n`
      } else {
        where += `${key}: "${options[key] as string}",`
      }
    }

    // TODO: we need a way to get proposals only for this DAO, https://github.com/daostack/subgraph/issues/40
    const query = gql`
      {
        proposals(where: {
          ${where}
        }) {
          id
        }
      }
    `

    return this.context._getObservableList(
      query,
      'proposals',
      (r: any) => new Proposal(r.id, this.context)
    ) as Observable<Proposal[]>
  }

  public proposal(id: string): Proposal {
    return new Proposal(id, this.context)
  }

  public rewards(options: IRewardQueryOptions = {}): Observable<Reward[]> {
    // TODO: we need a way to get rewards only for this DAO, https://github.com/daostack/subgraph/issues/40
    let where = ''
    for (const key of Object.keys(options)) {
      where += `${key}: "${options[key] as string},\n"`
    }

    const query = gql`
      {
        rewards (where: {
          ${where}
        }) {
          id
        }
      }
    `

    return this.context._getObservableList(
      query,
      'rewards',
      (r: any) => new Reward(r.id, this.context)
    ) as Observable<Reward[]>
  }

  public votes(options: IVoteQueryOptions = {}): Observable < IVote[] > {
    throw new Error('not implemented')
  }

  public stakes(options: IStakeQueryOptions = {}): Observable < IStake[] > {
    throw new Error('not implemented')
  }
}

export interface IDAOQueryOptions extends ICommonQueryOptions {
  address?: Address
  name?: string
}
