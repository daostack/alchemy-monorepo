import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { Address } from './types'
import { realMathToNumber } from './utils'

export interface IQueueState {
  id: string
  name: string
  threshold: BN
  dao: Address
  votingMachine: Address

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
      let name = item.name
      if (!name) {
        // if the item has no name, we check if we know the name already
        console.log('looking for name of', item.address)
        console.log(context.contractAddresses)
        for (const key of Object.keys(context.contractAddresses)) {
          console.log(key)
          if (context.contractAddresses[key].toLowerCase() === item.address.toLowerCase()) {
            console.log('FOUND IT')
            name = key
            break
          }
        }
      }
      console.log(name)
      console.log('Querying for', options.name)
      console.log(name === options.name)
      if (options.name && options.name !== name) {
        return null
      }

      return new Queue(
        item.id,
        item.dao.id,
        name,
        context
      )
    }

    return context._getObservableList(query, itemMap, apolloQueryOptions) as Observable<Queue[]>
  }
  public id: Address
  public dao: Address
  public name: string

  constructor(id: Address, dao: Address, name: string, public context: Arc) {
    this.context = context
    this.id = id
    this.dao = dao
    this.name = name
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
            canDeltegateCall
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
        // no gpqueue was found - we construct one with basic default values
        return {
          dao: this.dao,
          id: this.id,
          name: this.name,
          threshold: new BN(1),
          votingMachine: this.context.contractAddresses.GenesisProtocol
        }
      }

      const threshold: BN = realMathToNumber(new BN(item.threshold))

      return {
        dao: item.dao.id,
        id: item.id,
        name: item.queue.name,
        threshold,
        votingMachine: item.votingMachine
      }
    }
    return this.context._getObservableObject(query, itemMap) as Observable<IQueueState>
  }
}
