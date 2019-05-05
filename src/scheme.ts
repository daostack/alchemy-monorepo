import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc } from './arc'
import { DAO } from './dao'
import { Address } from './types'

export interface IScheme {
  address: Address
  canDelegateCall: boolean
  canRegisterSchemes: boolean
  canUpgradeController: boolean
  canManageGlobalConstraints: boolean
  dao: DAO
  id: string
  name: string
  paramsHash: string
}

export class Scheme implements IScheme {

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
       name
       paramsHash
     }
   }`
    const itemMap = (item: any): Scheme => {
      return new Scheme(
        item.id,
        item.address,
        item.canDelegateCall,
        item.canManageGlobalConstraints,
        item.canRegisterSchemes,
        item.canUpgradeController,
        new DAO(item.dao.id, context),
        item.name,
        item.paramsHash,
        context
      )
    }

    return context.getObservableList(query, itemMap) as Observable<Scheme[]>
  }

  constructor(
    public id: string,
    public address: Address,
    public canDelegateCall: boolean,
    public canRegisterSchemes: boolean,
    public canUpgradeController: boolean,
    public canManageGlobalConstraints: boolean,
    public dao: DAO,
    public name: string,
    public paramsHash: string,
    public context: Arc
  ) {
    this.context = context
  }

}
