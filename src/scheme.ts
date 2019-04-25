import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc } from './arc'
import { DAO } from './dao'
import { Address } from './types'

export interface IScheme {
  id: string
  address: Address
  dao: DAO
  canDelegateCall: boolean
  canRegisterSchemes: boolean
  canUpgradeController: boolean
  canManageGlobalConstraints: boolean
}

export class Scheme {
  public static search(options: {dao?: Address}, context: Arc): Observable<Scheme[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      const value = (options as any)[key]
      if (value !== undefined) {
        if (key === 'dao')  {
          where += `dao: "${value}"\n`
        } else {
          where += `${key}: "${value}"\n`
        }
      }
    }

    const query = gql` {
     controllerSchemes  (where: {${where}}) {
       id
       address
       dao { id }
       canDelegateCall
       canRegisterSchemes
       canUpgradeController
       canManageGlobalConstraints
       paramsHash
     }
   }`
    const itemMap = (item: any): Scheme => {
      return new Scheme({
        address: item.address,
        canDelegateCall: item.canDelegateCall,
        canManageGlobalConstraints: item.canManageGlobalConstraints,
        canRegisterSchemes: item.canRegisterSchemes,
        canUpgradeController: item.canUpgradeController,
        dao: new DAO(item.dao.id, context),
        id: item.id
      }, context)
    }

    return context._getObservableList(query, itemMap) as Observable<Scheme[]>
  }

  constructor(options: IScheme, public context: Arc) {
    this.context = context
    for (const key of Object.keys(options)) {
      (this as any)[key] = (options as any)[key]
    }
  }

}
