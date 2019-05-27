import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { first, map } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { IMemberQueryOptions, Member } from './member'
import { IProposalCreateOptions, IProposalQueryOptions, Proposal } from './proposal'
import { Reputation } from './reputation'
import { IRewardQueryOptions, Reward } from './reward'
import { ISchemeQueryOptions, Scheme } from './scheme'
import { IStake, IStakeQueryOptions, Stake } from './stake'
import { Token } from './token'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { BN, isAddress } from './utils'
import { IVote, IVoteQueryOptions, Vote } from './vote'

export interface IDAOState {
  address: Address // address of the avatar
  name: string
  reputation: Reputation
  memberCount: number
  reputationTotalSupply: typeof BN
  token: Token
  tokenName: string
  tokenSymbol: string
  tokenTotalSupply: typeof BN
}

export interface IDAOQueryOptions extends ICommonQueryOptions {
  address?: Address
  name?: string
  register?: 'na'|'proposed'|'registered'|'unRegistered'
}

export class DAO implements IStateful<IDAOState> {

  /**
   * DAO.search(context, options) searches for DAO entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. IDAOQueryOptions
   * @return         an observable of DAO objects
   */
  public static search(
    context: Arc,
    options: IDAOQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<DAO[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      if (options[key] === undefined) {
        continue
      }

      if (key === 'address') {
        const option = options[key] as string
        isAddress(option)
        options[key] = option.toLowerCase()
      }

      where += `${key}: "${options[key] as string}"\n`
    }

    const query = gql`{
      daos(where: {
        ${where}
      }) {
        id
      }
    }`

    return context.getObservableList(
      query,
      (r: any) => new DAO(r.id, context),
      apolloQueryOptions
    )
  }

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
        reputationHoldersCount
      }
    }`

    const itemMap = (item: any): IDAOState => {
      if (item === null) {
        throw Error(`Could not find a DAO with address ${this.address}`)
      }
      return {
        address: item.id,
        memberCount: Number(item.reputationHoldersCount),
        name: item.name,
        reputation: new Reputation(item.nativeReputation.id, this.context),
        reputationTotalSupply: new BN(item.nativeReputation.totalSupply),
        token: new Token(item.nativeToken.id, this.context),
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

  public schemes(options: ISchemeQueryOptions = {}): Observable<Scheme[]> {
    options.dao = this.address
    return Scheme.search(this.context, options)
  }

  public async scheme(options: ISchemeQueryOptions): Promise<Scheme> {
    const schemes = await this.schemes(options).pipe(first()).toPromise()
    if (schemes.length === 1) {
      return schemes[0]
    } else {
      throw Error('Could not find a unique scheme satisfying these options')
    }
  }
  public members(options: IMemberQueryOptions = {}): Observable<Member[]> {
    let where = ''
    options.dao = this.address
    for (const key of Object.keys(options)) {
      where += `${key}: "${options[key]}"\n`
    }
    const query = gql`{
      reputationHolders (where: {
        ${where}
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

  /**
   * create a new proposal in this DAO
   * @param  options [description]
   * @return a Proposal instance
   */
  public createProposal(options: IProposalCreateOptions) {
    options.dao = this.address
    return Proposal.create(options, this.context)
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
    options.dao = this.address
    return Proposal.search(this.context, options)
  }

  public async proposal(proposalId: string): Promise<Proposal> {
    const proposals =  await this.proposals({id: proposalId}).pipe(first()).toPromise()
    if (proposals) {
      return proposals[0]
    } else {
      throw new Error(`No proposal with id ${proposalId} could be found`)
    }
  }

  public rewards(options: IRewardQueryOptions = {}): Observable<Reward[]> {
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

  public ethBalance(): Observable<typeof BN> {
    return this.context.ethBalance(this.address)
  }
}
