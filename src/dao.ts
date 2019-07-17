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
import { BN, createGraphQlQuery, isAddress } from './utils'
import { IVote, IVoteQueryOptions, Vote } from './vote'

export interface IDAOState {
  address: Address // address of the avatar
  dao: DAO
  memberCount: number
  name: string
  reputation: Reputation
  reputationTotalSupply: typeof BN
  token: Token
  tokenName: string
  tokenSymbol: string
  tokenTotalSupply: typeof BN
}

export interface IDAOQueryOptions extends ICommonQueryOptions {
  where?: {
    address?: Address
    name?: string
    register?: 'na'|'proposed'|'registered'|'unRegistered'
    [key: string]: any
  }
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
    if (!options.where) {
      options.where = {}
    }
    for (const key of Object.keys(options.where)) {
      if (options.where[key] === undefined) {
        continue
      }

      if (key === 'address') {
        const option = options.where[key] as string
        isAddress(option)
        options.where[key] = option.toLowerCase()
      }

      where += `${key}: "${options.where[key] as string}"\n`
    }

    const query = gql`{
      daos ${createGraphQlQuery(options, where)} {
        id
      }
    }`

    return context.getObservableList(
      query,
      (r: any) => new DAO(r.id, context),
      apolloQueryOptions
    )
  }

  public address: Address

  constructor(public id: Address, public context: Arc) {
    this.id = id.toLowerCase()
    this.address = this.id
    this.context = context
  }

  /**
   * get the current state of the DAO
   * @return an Observable of IDAOState
   */
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
        dao: this,
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
    if (!options.where) { options.where = {}}
    options.where.dao = this.address
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
    if (!options.where) { options.where = {}}
    options.where.dao = this.address
    for (const key of Object.keys(options.where)) {
      where += `${key}: "${options.where[key]}"\n`
    }
    const query = gql`{
      reputationHolders ${createGraphQlQuery(options, where)} {
        id
        address
      }
    }`
    const itemMap = (item: any): Member => new Member({address: item.address, dao: this.address}, this.context)
    return this.context.getObservableList(query, itemMap) as Observable<Member[]>
  }

  public member(address: Address): Member {
    return new Member({ address, dao: this.address}, this.context)
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
    if (!options.where) {
      options.where = {}
    }
    options.where.dao = this.address
    return Proposal.search(this.context, options)
  }

  public proposal(proposalId: string): Proposal {
    return new Proposal(proposalId, this.context)
  }

  public rewards(options: IRewardQueryOptions = {}): Observable<Reward[]> {
    if (!options.where) { options.where = {}}
    options.where.dao = this.address
    return Reward.search(this.context, options)
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    if (!options.where) { options.where = {}}
    options.where.dao = this.address
    return Vote.search(this.context, options)
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    if (!options.where) { options.where = {}}
    options.where.dao = this.address
    return Stake.search(this.context, options)
  }

  public ethBalance(): Observable<typeof BN> {
    return this.context.ethBalance(this.address)
  }
}
