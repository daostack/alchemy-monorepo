import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { Operation } from './operation'
import { IProposalCreateOptions, IProposalQueryOptions, Proposal } from './proposal'
import * as ContributionReward from './schemes/contributionReward'
import * as GenericScheme from './schemes/genericScheme'
import * as SchemeRegistrar from './schemes/schemeRegistrar'
import { Address } from './types'
import { isAddress } from './utils'

export interface ISchemeState {
  id: string
  name: string
  address: Address
  canDelegateCall: boolean
  canRegisterSchemes: boolean
  canUpgradeController: boolean
  canManageGlobalConstraints: boolean
  dao: Address
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
  [key: string]: any
}

/**
 * A Scheme represents a scheme instance that is registered at a DAO
 */
export class Scheme {

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

    const query = gql`{
      controllerSchemes (where: {${where}})
      {
        id
        address
        dao { id }
        name
      }
    }`
    const itemMap = (item: any): Scheme|null => {
      // TODO: remove next lines after resolution of https://github.com/daostack/subgraph/issues/238
      let name = item.name
      if (!name) {
        try {
          name = context.getContractInfo(item.address).name
        } catch (err) {
          // pass
        }
      }
      if (options.name && options.name !== name) {
        return null
      }
      return new Scheme(
        item.id,
        item.dao.id,
        name,
        item.address,
        context
      )
    }

    return context.getObservableList(
      query,
      itemMap,
      apolloQueryOptions
    ) as Observable<Scheme[]>
  }

  public address: Address
  public id: Address
  public dao: Address
  public name: string

  constructor(id: Address, dao: Address, name: string, address: Address, public context: Arc) {
    this.context = context
    this.id = id
    this.dao = dao
    this.name = name
    this.address = address
  }

  public state(): Observable<ISchemeState> {
    const query = gql`
      {
        controllerScheme (id: "${this.id}") {
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
      }
    `

    const itemMap = (item: any): ISchemeState|null => {

      const name = item.name || this.context.getContractInfo(item.address).name
      return {
        address: item.address,
        canDelegateCall: item.canDelegateCall,
        canManageGlobalConstraints: item.canManageGlobalConstraints,
        canRegisterSchemes: item.canRegisterSchemes,
        canUpgradeController: item.canUpgradeController,
        dao: item.dao.id,
        id: item.id,
        name,
        paramsHash: item.paramsHash
      }
    }
    return this.context.getObservableObject(query, itemMap) as Observable<ISchemeState>
  }

    /**
     * create a new proposal in this DAO
     * TODO: move this to the schemes - we should call proposal.scheme.createProposal
     * @param  options [description ]
     * @return a Proposal instance
     */
    public createProposal(options: IProposalCreateOptions): Operation<Proposal>  {
      let msg: string
      const context = this.context
      let createTransaction: () => any = () => null
      let map: any

      switch (this.name) {
      // ContributionReward
        case 'ContributionReward':
          createTransaction  = ContributionReward.createTransaction(options, this.context)
          map = ContributionReward.createTransactionMap(options, this.context)
          break

        // GenericScheme
        case 'GenericScheme':
          createTransaction  = GenericScheme.createTransaction(options, this.context)
          map = GenericScheme.createTransactionMap(options, this.context)
          break

        // SchemeRegistrar
        case 'SchemeRegistrar':
          createTransaction  = SchemeRegistrar.createTransaction(options, this.context)
          map = SchemeRegistrar.createTransactionMap(options, this.context)
          break

        default:
          msg = `Unknown proposal scheme: "${this.name}"`
          throw Error(msg)
      }

      return context.sendTransaction(createTransaction, map)
    }

    public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
      options.scheme = this.address
      return Proposal.search(this.context, options)
    }

}
