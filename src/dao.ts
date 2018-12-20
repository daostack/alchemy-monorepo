import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
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
import * as utils from './utils'

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
  // TODO: the following fields are placeholders for legacy stuff that alchemy expects
  // these properties should be removed
  externalTokenSymbol: string,
  externalTokenAddress: Address
}

export class DAO implements IStateful<IDAOState> {
  public state: Observable<IDAOState>

  constructor(public address: Address, public context: Arc) {

    this.address = address.toLowerCase()

    const query = gql`{
      dao(id: "${address}") {
        id
        members { id },
        name,
        nativeReputation { id, totalSupply },
        nativeToken { id, name, symbol, totalSupply },
      }
    }`

    const itemMap = (item: any): IDAOState => {
      if (item === null) {
        throw Error(`Could not find a DAO with address ${address}`)
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
      reputationHolders {
        id
      }
    }`
    const itemMap = (item: any): Member => new Member(item.id, this.address)
    return this.context._getObservableList(query, 'reputationHolders', itemMap) as Observable<Member[]>
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {

    // TODO: there must be  better way to construct a where clause from a dictionary
    let where = ''
    for (const key of Object.keys(options)) {
      if (key === 'stage' && options[key] !== undefined) {
        where += `${key}: ${ProposalStage[options[key] as ProposalStage]},\n`
      } else {
        where += `${key}: "${options[key] as string},\n"`
      }
    }

    // TODO: we need a way to get proposals only for this DAO, https://github.com/daostack/subgraph/issues/40
    const query = gql`
      {
        proposals(where: {
          # dao.id: "${this.address}"
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
    throw new Error('not implemented')
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    throw new Error('not implemented')
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    throw new Error('not implemented')
  }
}

export interface IDAOQueryOptions extends ICommonQueryOptions {
  address?: Address
  name?: string
}
