import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { first, map } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { IMemberQueryOptions, Member } from './member'
import { IProposalCreateOptions, IProposalQueryOptions, Proposal } from './proposal'
import { Reputation } from './reputation'
import { IRewardQueryOptions, Reward } from './reward'
import { ISchemeQueryOptions, Scheme } from './scheme'
import { IStakeQueryOptions, Stake } from './stake'
import { Token } from './token'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { BN, createGraphQlQuery, isAddress } from './utils'
import { IVoteQueryOptions, Vote } from './vote'

export interface IDAOStaticState {
  id: Address
  address: Address // address of the avatar
  name: string
  reputation: Reputation
  token: Token
  tokenName: string
  tokenSymbol: string
}

export interface IDAOState extends IDAOStaticState {
  memberCount: number
  reputationTotalSupply: typeof BN
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

  public id: Address
  public staticState: IDAOStaticState|undefined

  constructor(public idOrOpts: Address|IDAOStaticState, public context: Arc) {
    if (typeof idOrOpts === 'string') {
      this.id = idOrOpts.toLowerCase()
    } else {
      this.id = idOrOpts.address
      this.setStaticState(idOrOpts)
    }
  }

  public setStaticState(opts: IDAOStaticState) {
    this.staticState = opts
  }

  public async fetchStaticState(): Promise<IDAOStaticState> {
    if (!!this.staticState) {
      return this.staticState
    } else {
      const state =  await this.state().pipe(first()).toPromise()
      const staticState = {
        address: state.address,
        id: state.id,
        name: state.name,
        reputation: state.reputation,
        token: state.token,
        tokenName: state.tokenName,
        tokenSymbol: state.tokenSymbol
      }
      this.setStaticState(staticState)
      return staticState
    }
  }

  /**
   * get the current state of the DAO
   * @return an Observable of IDAOState
   */
  public state(): Observable<IDAOState> {
    const query = gql`{
      dao(id: "${this.id}") {
        id
        name
        nativeReputation { id, totalSupply }
        nativeToken { id, name, symbol, totalSupply }
        reputationHoldersCount
      }
    }`

    const itemMap = (item: any): IDAOState => {
      if (item === null) {
        throw Error(`Could not find a DAO with id ${this.id}`)
      }
      return {
        address: item.id,
        id: item.id,
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
    options.where.dao = this.id
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
    options.where.dao = this.id
    for (const key of Object.keys(options.where)) {
      where += `${key}: "${options.where[key]}"\n`
    }
    const query = gql`{
      reputationHolders ${createGraphQlQuery(options, where)} {
        id
        address
      }
    }`
    const itemMap = (item: any): Member => new Member({address: item.address, dao: this.id}, this.context)
    return this.context.getObservableList(query, itemMap) as Observable<Member[]>
  }

  public member(address: Address): Member {
    return new Member({ address, dao: this.id}, this.context)
  }

  /**
   * create a new proposal in this DAO
   * @param  options [description]
   * @return a Proposal instance
   */
  public createProposal(options: IProposalCreateOptions) {
    options.dao = this.id
    return Proposal.create(options, this.context)
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
    if (!options.where) {
      options.where = {}
    }
    options.where.dao = this.id
    return Proposal.search(this.context, options)
  }

  public proposal(proposalId: string): Proposal {
    return new Proposal(proposalId, this.context)
  }

  public rewards(options: IRewardQueryOptions = {}): Observable<Reward[]> {
    if (!options.where) { options.where = {}}
    options.where.dao = this.id
    return Reward.search(this.context, options)
  }

  public votes(options: IVoteQueryOptions = {}): Observable<Vote[]> {
    if (!options.where) { options.where = {}}
    options.where.dao = this.id
    return Vote.search(this.context, options)
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<Stake[]> {
    if (!options.where) { options.where = {}}
    options.where.dao = this.id
    return Stake.search(this.context, options)
  }

  public ethBalance(): Observable<typeof BN> {
    return this.context.ethBalance(this.id)
  }
}
