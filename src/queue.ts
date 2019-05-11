import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc } from './arc'
import { DAO } from './dao'
import { ISchemeState } from './scheme'
import { Address } from './types'
import { realMathToNumber } from './utils'

export interface IQueueState {
  dao: DAO
  id: string
  name: string
  scheme: ISchemeState
  threshold: number
  votingMachine: Address
}

export class Queue {

  public static search(options: {dao?: Address, name?: string}, context: Arc): Observable<Queue[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      const value = (options as any)[key]
      if (value !== undefined) {
        if (key === 'dao')  {
          where += `dao: "${value}"\n`
        } else if (key !== 'name') {
          where += `${key}: "${value}"\n`
        }
      }
    }

    // use the following query once https://github.com/daostack/subgraph/issues/217 is resolved
    // const query = gql`
    //   {
    //     gpqueues (where: {${where}}) {
    //       id
    //       dao {
    //         id
    //       }
    //       scheme {
    //         id
    //         address
    //         name
    //       }
    //     }
    //   }
    // `
    const query = gql`{
      controllerSchemes (where: {${where}}) {
        id
        dao { id }
        name
        address
      }
    }`
    console.log(query.loc.source.body)
    const itemMap = (item: any): Queue|null => {
      const scheme = item
      const name = scheme.name || context.getContractName(scheme.address)
      // we must filter explictly by name as the subgraph does not return the name
      if (options.name && options.name !== name) {
        return null
      }
      return new Queue(
        item.id,
        new DAO(item.dao.id, context),
        name,
        context
      )
    }

    return context.getObservableList(query, itemMap) as Observable<Queue[]>
  }

  constructor(
    public id: string,
    public dao: DAO,
    public name: string,
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
      console.log(item)
      const threshold = realMathToNumber(new BN(item.threshold))
      const schemeName = item.scheme.name || this.context.getContractName(item.scheme.address)
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
