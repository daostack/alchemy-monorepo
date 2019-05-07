import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { Address } from './types'
import { realMathToNumber } from './utils'

export interface IQueueState {
  id: string
  name: string
  threshold: number
  dao: Address
  votingMachine: Address
  scheme: Address
}

export class Queue {
  public static search(
    options: {
      dao?: Address,
      name?: string
    },
    context: Arc,
    apolloQueryOptions: IApolloQueryOptions = {}
): Observable<Queue[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      const value = (options as any)[key]
      // querying by'name' will not be predicable as the name is not always populated
      if (value !== undefined && value !== 'name') {
        where += `${key}: "${value}"\n`
      }
    }

    const query = gql` {
     controllerSchemes (where: {${where}}) {
       id
       dao { id }
       name
       address
     }
   }`
    const itemMap = (item: any): Queue|null => {
      const name = item.name || context.getContractName(item.address)
      if (options.name && options.name !== name) {
        return null
      }

      return new Queue(
        item.id,
        item.dao.id,
        name,
        item.address,
        context
      )
    }

    return context.getObservableList(query, itemMap, apolloQueryOptions) as Observable<Queue[]>
  }
  public id: Address
  public dao: Address
  public name: string
  public scheme: Address;

  constructor(id: Address, dao: Address, name: string, scheme: Address, public context: Arc) {
    this.context = context
    this.id = id
    this.dao = dao
    this.name = name
    this.scheme = scheme
  }

  public state(): Observable<IQueueState> {
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

    const itemMap = (item: any): IQueueState|null => {
      if (item === null) {
        // no queue was found - we construct one with basic default values
        return {
          dao: this.dao,
          id: this.id,
          name: this.name,
          scheme: this.scheme,
          threshold: 1,
          votingMachine: this.context.contractAddresses.GenesisProtocol
        }
      }

      const threshold = realMathToNumber(new BN(item.threshold))

      return {
        dao: item.dao.id,
        id: item.id,
        name: item.queue.name,
        scheme: item.scheme.address,
        threshold,
        votingMachine: item.votingMachine
      }
    }
    return this.context.getObservableObject(query, itemMap) as Observable<IQueueState>
  }
}
