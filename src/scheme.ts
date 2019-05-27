import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { DAO } from './dao'
import { Address } from './types'
import { isAddress } from './utils'

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

export interface ISchemeQueryOptions {
  address?: Address
  canDelegateCall?: boolean
  canRegisterSchemes?: boolean
  canUpgradeController?: boolean
  canManageGlobalConstraints?: boolean
  dao?: Address
  id?: string
  name?: string
  paramsHash?: string
}

export class Scheme implements IScheme {

  /**
   * Scheme.search(context, options) searches for scheme entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. ISchemeQueryOptions
   * @return         an observable of Scheme objects
   */
  public static search(
    context: Arc,
    options: ISchemeQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Scheme[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      if (options[key] === undefined) {
        continue
      }

      if (key === 'address' || key === 'dao') {
        const option = options[key] as string
        isAddress(option)
        options[key] = option.toLowerCase()
      }

      where += `${key}: "${options[key] as string}"\n`
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

    return context.getObservableList(
      query,
      itemMap,
      apolloQueryOptions
    ) as Observable<Scheme[]>
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
