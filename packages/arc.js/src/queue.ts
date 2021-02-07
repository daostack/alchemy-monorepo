import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { DAO } from './dao'
import { ISchemeState, Scheme } from './scheme'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { createGraphQlQuery, isAddress, realMathToNumber } from './utils'

export interface IQueueStaticState {
  dao: DAO
  id: string
  name: string
}

export interface IQueueState extends IQueueStaticState {
  scheme: ISchemeState
  threshold: number
  votingMachine: Address
}

export interface IQueueQueryOptions extends ICommonQueryOptions {
  where?: {
    dao?: Address,
    votingMachine?: Address
    scheme?: Address
    [key: string]: any
  }
}

export class Queue implements IStateful<IQueueState> {

  /**
   * Queue.search(context, options) searches for queue entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. IQueueQueryOptions
   * @return         an observable of Queue objects
   */
  public static search(
    context: Arc,
    options: IQueueQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
): Observable<Queue[]> {
    if (!options.where) { options.where = {}}
    let where = ''
    for (const key of Object.keys(options.where)) {
      if (options[key] === undefined) {
        continue
      }

      if (key === 'dao' || key === 'votingMaching' || key === 'scheme') {
        const option = options[key] as string
        isAddress(option)
        options[key] = option.toLowerCase()
      }

      where += `${key}: "${options[key] as string}"\n`
    }

    // use the following query once https://github.com/daostack/subgraph/issues/217 is resolved
    const query = gql`query QueueSearch
      {
        gpqueues ${createGraphQlQuery(options, where)} {
          id
          dao {
            id
          }
          scheme {
            id
            address
            name
            numberOfBoostedProposals
            numberOfPreBoostedProposals
            numberOfQueuedProposals
          }
        }
      }
    `
    const itemMap = (item: any): Queue|null => {
      // we must filter explictly by name as the subgraph does not return the name

      return new Queue(
        item.id,
        new DAO(item.dao.id, context),
        context
      )
    }

    return context.getObservableList(query, itemMap, apolloQueryOptions) as Observable<Queue[]>
  }

  constructor(
    public id: string,
    public dao: DAO,
    public context: Arc
  ) {
    this.context = context
  }

  public state(apolloQueryOptions: IApolloQueryOptions = {}): Observable<IQueueState> {
    //
    const query = gql`query QueueState
      {
        gpqueue (id: "${this.id}") {
          id
          dao {
            id
          }
          scheme {
            ...SchemeFields
          }
          votingMachine
          threshold
        }
      }
      ${Scheme.fragments.SchemeFields}
    `

    const itemMap = (item: any): IQueueState => {
      if (!item) {
        throw Error(`No gpQueue with id ${this.id} was found`)
      }
      const threshold = realMathToNumber(new BN(item.threshold))
      const scheme = Scheme.itemMap(item.scheme, this.context) as ISchemeState
      return {
        dao: item.dao.id,
        id: item.id,
        name: scheme.name,
        scheme,
        threshold,
        votingMachine: item.votingMachine
      }
    }
    return  this.context.getObservableObject(query, itemMap, apolloQueryOptions) as Observable<IQueueState>
  }
}
