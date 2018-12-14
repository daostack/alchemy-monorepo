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
  members: number
  name: string
  reputation: Reputation
  token: Token
}

export class DAO implements IStateful<IDAOState> {
  public state: Observable<IDAOState>
  public address: Address
  private context: Arc

  constructor(address: Address, context: Arc) {
    this.context = context
    this.address = address.toLowerCase()

    const query = gql`{
          dao(id: "${address}") {
            id
            members { id },
            name,
            nativeReputation { id },
            nativeToken { id },
          }
        }`

    const itemMap = (item: any): IDAOState => { return {
      address: item.id,
      // TODO: getting all members is not really scaleable - we need a way ot get the member count
      // from the subgraph
      members: item.members.length,
      name: item.name,
      reputation: new Reputation(item.nativeReputation.id),
      token: new Token(item.nativeToken.id)
    }}
    this.state = this.context._getObjectObservable(query, 'dao', itemMap) as Observable<IDAOState>
  }

  public members(options: IMemberQueryOptions = {}): Observable<Member[]> {
    throw new Error('not implemented')
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
    throw new Error('not implemented')
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
