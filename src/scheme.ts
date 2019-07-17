import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { IGenesisProtocolParams, mapGenesisProtocolParams } from './genesisProtocol'
import { Operation } from './operation'
import { IProposalCreateOptions, IProposalQueryOptions, Proposal } from './proposal'
import * as ContributionReward from './schemes/contributionReward'
import * as GenericScheme from './schemes/genericScheme'
import * as SchemeRegistrar from './schemes/schemeRegistrar'
import { Address, ICommonQueryOptions } from './types'
import { createGraphQlQuery, isAddress } from './utils'

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
  contributionRewardParams?: {
    votingMachine: Address
    voteParams: IGenesisProtocolParams
  } | null
  genericSchemeParams?: {
    votingMachine: Address
    contractToCall: Address
    voteParams: IGenesisProtocolParams
  } | null
  schemeRegistrarParams?: {
    votingMachine: Address
    voteRemoveParams: IGenesisProtocolParams
    voteRegisterParams: IGenesisProtocolParams
  } | null
}

export interface ISchemeQueryOptions extends ICommonQueryOptions {
  where?: {
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
    if (!options.where) { options.where = {}}
    for (const key of Object.keys(options.where)) {
      if (options.where[key] === undefined) {
        continue
      }

      if (key === 'address' || key === 'dao') {
        const option = options.where[key] as string
        isAddress(option)
        options.where[key] = option.toLowerCase()
      }

      where += `${key}: "${options.where[key] as string}"\n`
    }

    const query = gql`{
      controllerSchemes ${createGraphQlQuery(options, where)}
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
      if (!options.where) { options.where = {}}
      if (options.where.name && options.where.name !== name) {
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
          contributionRewardParams {
            votingMachine
            voteParams {
              queuedVoteRequiredPercentage
              queuedVotePeriodLimit
              boostedVotePeriodLimit
              preBoostedVotePeriodLimit
              thresholdConst
              limitExponentValue
              quietEndingPeriod
              proposingRepReward
              votersReputationLossRatio
              minimumDaoBounty
              daoBountyConst
              activationTime
              voteOnBehalf
            }
          }
          genericSchemeParams {
            votingMachine
            contractToCall
            voteParams {
              queuedVoteRequiredPercentage
              queuedVotePeriodLimit
              boostedVotePeriodLimit
              preBoostedVotePeriodLimit
              thresholdConst
              limitExponentValue
              quietEndingPeriod
              proposingRepReward
              votersReputationLossRatio
              minimumDaoBounty
              daoBountyConst
              activationTime
              voteOnBehalf
            }
          }
          schemeRegistrarParams {
            votingMachine
            voteRemoveParams {
              queuedVoteRequiredPercentage
              queuedVotePeriodLimit
              boostedVotePeriodLimit
              preBoostedVotePeriodLimit
              thresholdConst
              limitExponentValue
              quietEndingPeriod
              proposingRepReward
              votersReputationLossRatio
              minimumDaoBounty
              daoBountyConst
              activationTime
              voteOnBehalf
            }
            voteRegisterParams {
              queuedVoteRequiredPercentage
              queuedVotePeriodLimit
              boostedVotePeriodLimit
              preBoostedVotePeriodLimit
              thresholdConst
              limitExponentValue
              quietEndingPeriod
              proposingRepReward
              votersReputationLossRatio
              minimumDaoBounty
              daoBountyConst
              activationTime
              voteOnBehalf
            }
          }
        }
      }
    `

    const itemMap = (item: any): ISchemeState|null => {

      const name = item.name || this.context.getContractInfo(item.address).name
      let genericScheme: GenericScheme.IGenericSchemeInfo|undefined
      if (item.genericSchemeParams) {
        genericScheme = {
          contractToCall: item.genericSchemeParams.contractToCall,
          id: item.genericSchemeParams.id,
          votingMachine: item.genericSchemeParams.votingMachine
        }
      } else {
        genericScheme = undefined
      }
      return {
        address: item.address,
        canDelegateCall: item.canDelegateCall,
        canManageGlobalConstraints: item.canManageGlobalConstraints,
        canRegisterSchemes: item.canRegisterSchemes,
        canUpgradeController: item.canUpgradeController,
        contributionRewardParams: item.contributionRewardParams ? {
          voteParams: mapGenesisProtocolParams(item.contributionRewardParams.voteParams),
          votingMachine: item.contributionRewardParams.votingMachine
        } : null,
        dao: item.dao.id,
        genericSchemeParams: item.genericSchemeParams ? {
          contractToCall: item.genericSchemeParams.contractToCall,
          voteParams: mapGenesisProtocolParams(item.genericSchemeParams.voteParams),
          votingMachine: item.genericSchemeParams.votingMachine
        } : null,
        id: item.id,
        name,
        paramsHash: item.paramsHash,
        schemeRegistrarParams: item.schemeRegistrarParams ? {
          voteRegisterParams: mapGenesisProtocolParams(item.schemeRegistrarParams.voteRegisterParams),
          voteRemoveParams: mapGenesisProtocolParams(item.schemeRegistrarParams.voteRemoveParams),
          votingMachine: item.schemeRegistrarParams.votingMachine
        } : null
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
    public createProposal(options: IProposalCreateOptions): Operation < Proposal >  {
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

    public proposals(options: IProposalQueryOptions = {}): Observable < Proposal[] > {
      if (!options.where) { options.where = {}}
      options.where.scheme = this.address
      return Proposal.search(this.context, options)
    }

}
