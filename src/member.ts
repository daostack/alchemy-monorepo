import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { DAO } from './dao'
import { toIOperationObservable } from './operation'
import { IProposalQueryOptions, Proposal } from './proposal'
import { Reward } from './reward'
import { IStakeQueryOptions, Stake } from './stake'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { BN } from './utils'
import { createGraphQlQuery, isAddress } from './utils'
import { IVoteQueryOptions, Vote } from './vote'

export interface IMemberStaticState {
  address: Address
  dao: Address,
}
export interface IMemberState extends IMemberStaticState {
  id: string
  reputation: typeof BN
}

export interface IMemberQueryOptions extends ICommonQueryOptions {
  where?: {
    address?: Address
    dao?: Address
  }
}

/**
 * Represents an account that holds reputaion in a specific DAO
 */

export class Member implements IStateful<IMemberState> {

  /**
   * Member.search(context, options) searches for member entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. IMemberQueryOptions
   * @return         an observable of IRewardState objects
   */
  public static search(
    context: Arc,
    options: IMemberQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Member[]> {
    let where = ''
    if (!options.where) { options.where = {}}
    for (const key of Object.keys(options.where)) {
      if (options.where[key] === undefined) {
        continue
      }

      if (key === 'address' || key === 'dao') {
        const option = options.where[key] as string
        isAddress(option)
        options.where[key] = option.toLowerCase()
      }

      where += `${key}: "${options.where[key] as string}"\n`
    }
    where += ' dao_not: null\n'

    const query = gql`{
      reputationHolders ${createGraphQlQuery(options, where)} {
        id
        address
        dao {
          id
        }
      }
    }`

    return context.getObservableList(
      query,
      (r: any) => new Member({ address: r.address, dao: r.dao.id}, context),
      apolloQueryOptions
    )
  }

  public id: string|undefined
  public staticState: IMemberStaticState|undefined

  /**
   * @param address addresssof the member
   * @param daoAdress addresssof the DAO this member is a member of
   * @param context an instance of Arc
   */
  constructor(idOrOpts: string|IMemberStaticState, public context: Arc) {
    if (typeof idOrOpts === 'string') {
      this.id = idOrOpts as string
    } else {
      const opts: IMemberStaticState = idOrOpts as IMemberStaticState
      isAddress(opts.address)
      isAddress(opts.dao)
      this.setStaticState(opts)
    }
  }

  public async fetchStaticState(): Promise<IMemberStaticState> {
    if (!!this.staticState) {
      return this.staticState
    } else {
      const state = await this.state().pipe(first()).toPromise()
      this.id = state.id
      this.staticState = {
        address: state.address,
        dao: state.dao
      }
      return this.staticState
    }
  }
  public setStaticState(opts: IMemberStaticState) {
    this.staticState = {
      address: opts.address.toLowerCase(),
      dao: opts.dao.toLowerCase()
    }
  }

  public state(): Observable<IMemberState> {
    let query: any
    if (this.id) {
      query = gql`{
          reputationHolder (
              id: "${this.id}"
          ) {
            id
            address
            dao {
              id
            }
            balance
          }
        }`
    } else {
      const staticState = this.staticState as IMemberStaticState
      query = gql`{
          reputationHolders (
            where: {
              address: "${staticState.address}"
              dao: "${staticState.dao}"
            }
          ) {
            id
            address
            dao {
              id
            }
            balance
          }
        }`
    }

    const itemMap = (items: any) => {
      if (items.length === 0) {
        throw Error(`This member was not found`)
      }
      const item = items[0]
      return {
          address: item.address,
          dao: item.dao.id,
          reputation: new BN(item.balance)
        }
      }
    return this.context.getObservableObject(query, itemMap) as Observable<IMemberState>
  }

  public async dao(): Promise<DAO> {
    const staticState = await this.fetchStaticState()
    return new DAO(staticState.dao, this.context)
  }

  public rewards(): Observable < Reward[] > {
    throw new Error('not implemented')
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
    const observable = Observable.create(async (observer: any) => {
      const state = await this.fetchStaticState()
      if (!options.where) { options.where = {} }
      options.where.proposer = state.address
      options.where.dao = state.dao
      const sub = Proposal.search(this.context, options).subscribe(observer)
      return () => sub.unsubscribe()
    })

    return toIOperationObservable(observable)
  }

  public stakes(options: IStakeQueryOptions = {}): Observable <Stake[]> {
    const observable = Observable.create(async (observer: any) => {
      const state = await this.fetchStaticState()
      if (!options.where) { options.where = {} }
      options.where.staker = state.address
      options.where.dao = state.dao
      const sub = Stake.search(this.context, options).subscribe(observer)
      return () => sub.unsubscribe()
    })

    return toIOperationObservable(observable)
  }

  public votes(options: IVoteQueryOptions = {}): Observable<Vote[]> {
    const observable = Observable.create(async (observer: any) => {
      const state = await this.fetchStaticState()
      if (!options.where) { options.where = {} }
      options.where.voter = state.address
      const sub = Vote.search(this.context, options).subscribe(observer)
      return () => sub.unsubscribe()
    })

    return toIOperationObservable(observable)
    }
}
