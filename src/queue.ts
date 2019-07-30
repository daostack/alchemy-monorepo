import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { DAO } from './dao'
import { ISchemeState } from './scheme'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { BN, createGraphQlQuery, isAddress, realMathToNumber } from './utils'

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
    const query = gql`
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

  public state(): Observable<IQueueState> {
    //
    const query = gql`
      {
        gpqueue (id: "${this.id}") {
          id
          dao {
            id
          }
          scheme {
            id
            address
            name
            dao { id }
            canDelegateCall
            canRegisterSchemes
            canUpgradeController
            canManageGlobalConstraints
            paramsHash
          }
          votingMachine
          threshold
        }
      }
    `

    const itemMap = (item: any): IQueueState => {
      if (!item) {
        throw Error(`No gpQueue with id ${this.id} was found`)
      }
      const threshold = realMathToNumber(new BN(item.threshold))
      const schemeName = item.scheme.name || this.context.getContractInfo(item.scheme.address).name
      return {
        dao: item.dao.id,
        id: item.id,
        name: schemeName,
        scheme: {
          address: item.scheme.address,
          canDelegateCall: item.scheme.canDelegateCall,
          canManageGlobalConstraints: item.scheme.canManageGlobalConstraints,
          canRegisterSchemes: item.scheme.canRegisterSchemes,
          canUpgradeController: item.scheme.canUpgradeController,
          dao: item.dao.id,
          id: item.scheme.id,
          name: schemeName,
          paramsHash: item.scheme.paramsHash
        },
        threshold,
        votingMachine: item.votingMachine
      }
    }
    return this.context.getObservableObject(query, itemMap) as Observable<IQueueState>
  }
}
