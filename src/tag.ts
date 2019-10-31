import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { Proposal } from './proposal'
import { ICommonQueryOptions, IStateful } from './types'
import { createGraphQlQuery } from './utils'

export interface ITagStaticState {
  id: string
  numberOfProposals: number
}

export interface ITagState extends ITagStaticState {
  id: string
  proposals: Proposal[]
}

export interface ITagQueryOptions extends ICommonQueryOptions {
  where?: {
    id?: string,
    proposal?: string
  }
}

export class Tag implements IStateful<ITagState> {
  public static fragments = {
    TagFields: gql`fragment TagFields on Tag {
      id
      numberOfProposals
      proposals { id }
    }`
  }

  /**
   * Tag.search(context, options) searches for stake entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. ITagQueryOptions
   * @return         an observable of Tag objects
   */
  public static search(
    context: Arc,
    options: ITagQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable <Tag[]> {
    if (!options.where) { options.where = {}}
    let where = ''

    const proposalId = options.where.proposal
    // if we are searching for stakes on a specific proposal (a common case), we
    // will structure the query so that stakes are stored in the cache together wit the proposal
    if (proposalId) {
      delete options.where.proposal
    }

    for (const key of Object.keys(options.where)) {
      if (options.where[key] === undefined) {
        continue
      }
      where += `${key}: "${options.where[key] as string}"\n`
    }

    let query
    const itemMap = (r: any) => {
      return new Tag({
        id: r.id,
        numberOfProposals: Number(r.numberOfProposals)
      }, context)
    }

    if (proposalId) {
      query = gql`query TagsSearchFromProposal
        {
          proposal (id: "${proposalId}") {
            id
            tags ${createGraphQlQuery(options, where)} {
              ...TagFields
            }
          }
        }
        ${Tag.fragments.TagFields}
      `

      return context.getObservableObject(
        query,
        (r: any) => {
          if (r === null) { // no such proposal was found
            return []
          }
          return r.tags.map(itemMap)
        },
        apolloQueryOptions
      ) as Observable<Tag[]>
    } else {
      query = gql`query TagsSearch
        {
          tags ${createGraphQlQuery(options, where)} {
              ...TagFields
          }
        }
        ${Tag.fragments.TagFields}
      `

      return context.getObservableList(
        query,
        itemMap,
        apolloQueryOptions
      ) as Observable<Tag[]>
    }
  }

  public id: string|undefined
  public staticState: ITagStaticState|undefined

  constructor(
      idOrOpts: string|ITagStaticState,
      public context: Arc
  ) {
    if (typeof idOrOpts === 'string') {
      this.id = idOrOpts
    } else {
      this.id = idOrOpts.id
      this.setStaticState(idOrOpts as ITagStaticState)
    }
  }

  public state(apolloQueryOptions: IApolloQueryOptions = {}): Observable<ITagState> {
    const query = gql`query TagState
      {
        tag (id: "${this.id}") {
          ...TagFields
        }
      }
      ${Tag.fragments.TagFields}
    `

    const itemMap = (item: any): ITagState => {
      if (item === null) {
        throw Error(`Could not find a Tag with id ${this.id}`)
      }
      this.setStaticState({
        id: item.id,
        numberOfProposals: Number(item.numberOfProposals)
      })
      return {
        id: item.id,
        numberOfProposals: Number(item.numberOfProposals),
        proposals: item.proposals.map((id: string) => new Proposal(id, this.context))
      }
    }
    return this.context.getObservableObject(query, itemMap, apolloQueryOptions)
  }

  public setStaticState(opts: ITagStaticState) {
    this.staticState = opts
  }

  public async fetchStaticState(): Promise<ITagStaticState> {
    if (!!this.staticState) {
      return this.staticState
    } else {
      const state = await this.state({subscribe: false}).pipe(first()).toPromise()
      this.setStaticState(state)
      return state
    }
  }

}
