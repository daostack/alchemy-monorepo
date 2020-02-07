import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { IProposalOutcome } from './proposal'
import { Address, Date, ICommonQueryOptions, IStateful } from './types'
import { createGraphQlQuery, isAddress } from './utils'

export interface IVoteStaticState {
  id?: string
  voter: Address
  createdAt: Date | undefined
  outcome: IProposalOutcome
  amount: BN // amount of reputation that was voted with
  proposal: string
  dao?: Address
}

export interface IVoteState extends IVoteStaticState {
  id: string
}

export interface IVoteQueryOptions extends ICommonQueryOptions {
  where?: {
    id?: string
    voter?: Address
    outcome?: IProposalOutcome
    proposal?: string
    dao?: Address
    [key: string]: any
  }
}

export class Vote implements IStateful<IVoteState> {
  public static fragments = {
    VoteFields: gql`fragment VoteFields on ProposalVote {
      id
      createdAt
      dao {
        id
      }
      voter
      proposal {
        id
      }
      outcome
      reputation
    }`
  }

  /**
   * Vote.search(context, options) searches for vote entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. IVoteQueryOptions
   * @return         an observable of Vote objects
   */
  public static search(
    context: Arc,
    options: IVoteQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable <Vote[]> {
    if (!options.where) { options.where = {}}
    const proposalId = options.where.proposal
    // if we are searching for votes of a specific proposal (a common case), we
    // will structure the query so that votes are stored in the cache together wit the proposal
    if (proposalId) {
      delete options.where.proposal
    }

    let where = ''
    for (const key of Object.keys(options.where)) {
      if (options.where[key] === undefined) {
        continue
      }

      if (key === 'voter' || key === 'dao') {
        const option = options.where[key] as string
        isAddress(option)
        options.where[key] = option.toLowerCase()
      }

      if (key === 'outcome') {
        where += `${key}: "${IProposalOutcome[options.where[key] as number]}"\n`
      } else {
        where += `${key}: "${options.where[key] as string}"\n`
      }
    }

    let query
    const itemMap = (r: any) => {
      let outcome: IProposalOutcome = IProposalOutcome.Pass
      if (r.outcome === 'Pass') {
        outcome = IProposalOutcome.Pass
      } else if (r.outcome === 'Fail') {
        outcome = IProposalOutcome.Fail
      } else {
        throw new Error(`Unexpected value for proposalVote.outcome: ${r.outcome}`)
      }
      return new Vote({
        amount: new BN(r.reputation || 0),
        createdAt: r.createdAt,
        dao: r.dao.id,
        id: r.id,
        outcome,
        proposal: r.proposal.id,
        voter: r.voter
      }, context)
    }

    // if we are searching for votes of a specific proposal (a common case), we
    // will structure the query so that votes are stored in the cache together with the proposal
    // if (options.where.proposal && !options.where.id) {
    if (proposalId && !options.where.id) {
      query = gql`query ProposalVotesSearchFromProposal
        {
          proposal (id: "${proposalId}") {
            id
            votes ${createGraphQlQuery({ where: { ...options.where, proposal: undefined}}, where)} {
              ...VoteFields
            }
          }
        }
        ${Vote.fragments.VoteFields}
      `

      return context.getObservableObject(
        query,
        (r: any) => {
          if (r === null) { // no such proposal was found
            return []
          }
          const votes = r.votes
          return votes.map(itemMap)
        },
        apolloQueryOptions
      ) as Observable<Vote[]>

    } else {
      query = gql`query ProposalVotesSearch
        {
          proposalVotes ${createGraphQlQuery(options, where)} {
            ...VoteFields
          }
        }
        ${Vote.fragments.VoteFields}
      `

      return context.getObservableList(
        query,
        itemMap,
        apolloQueryOptions
      ) as Observable<Vote[]>
    }
  }
  public id: string|undefined
  public staticState: IVoteStaticState|undefined

  constructor(idOrOpts: string|IVoteStaticState, public context: Arc) {
    if (typeof idOrOpts === 'string') {
      this.id = idOrOpts
    } else {
      const opts = idOrOpts as IVoteStaticState
      this.id = opts.id
      this.setStaticState(opts)
    }
  }

  public state(apolloQueryOptions: IApolloQueryOptions = {}): Observable<IVoteState> {
    const query = gql`query ProposalVoteById {
      proposalVote (id: "${this.id}") {
        ...VoteFields
      }
    }
    ${Vote.fragments.VoteFields}
    `

    const itemMap = (item: any): IVoteState => {
      if (item === null) {
        throw Error(`Could not find a Vote with id ${this.id}`)
      }
      return {
        amount: item.reputation,
        createdAt: item.createdAt,
        dao: item.dao.id,
        id: item.id,
        outcome: item.outcome,
        proposal: item.proposal.id,
        voter: item.voter
      }
    }
    return this.context.getObservableObject(query, itemMap, apolloQueryOptions)
  }

  public setStaticState(opts: IVoteStaticState) {
    this.staticState = opts
  }

  public async fetchStaticState(): Promise<IVoteStaticState> {
    if (!!this.staticState) {
      return this.staticState
    } else {
      return await this.state().pipe(first()).toPromise()
    }
  }
}
