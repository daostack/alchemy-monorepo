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
  Proposal
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
    this.state = this.context._getObjectObservable(query, 'dao', itemMap) as Observable<IDAOState>
  }

  public members(options: IMemberQueryOptions = {}): Observable<Member[]> {
    // TODO: show only members from this DAO
    const query = gql`{
      reputationHolders {
        id
      }
    }`
    const itemMap = (item: any): Member => new Member(item.id, this.address)
    return this.context._getObjectListObservable(query, 'reputationHolders', itemMap) as Observable<Member[]>
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
    // TODO: show only proposals from this DAO
    const query = gql`{
      proposals {
        id
      }
    }`
    const itemMap = (item: any): Proposal => new Proposal(item.id)
    return this.context._getObjectListObservable(query, 'proposals', itemMap) as Observable<Proposal[]>
  }

  public proposal(id: string): Proposal {
        return new Proposal(id)
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
