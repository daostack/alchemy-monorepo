import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { IGenesisProtocolParams, mapGenesisProtocolParams } from './genesisProtocol'
import { Operation, toIOperationObservable } from './operation'
import { IProposalCreateOptions, IProposalQueryOptions, Proposal } from './proposal'
import * as ContributionReward from './schemes/contributionReward'
import * as GenericScheme from './schemes/genericScheme'
import { ReputationFromTokenScheme } from './schemes/reputationFromToken'
import * as SchemeRegistrar from './schemes/schemeRegistrar'
import * as UGenericScheme from './schemes/uGenericScheme'
import { Address, ICommonQueryOptions, IStateful } from './types'
import { createGraphQlQuery, isAddress } from './utils'

export interface ISchemeStaticState {
  id: string
  address: Address
  dao: Address
  name: string
  paramsHash: string
  version: string
}

export interface ISchemeState extends ISchemeStaticState {
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
  numberOfQueuedProposals: number
  numberOfPreBoostedProposals: number
  numberOfBoostedProposals: number
  uGenericSchemeParams?: {
    votingMachine: Address
    contractToCall: Address
    voteParams: IGenesisProtocolParams
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
export class Scheme implements IStateful<ISchemeState> {
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
        options.where[key] = `"${option.toLowerCase()}"`
      } else if (key.endsWith('_in') || key.endsWith('_not_in')) {
        const option = options.where[key] as string[]
        options.where[key] = JSON.stringify(option)
      } else {
        const option = options.where[key] as string
        options.where[key] = `"${option}"`
      }
      where += `${key}: ${options.where[key] as string}\n`
    }

    const query = gql`query SchemeSearch {
      controllerSchemes ${createGraphQlQuery(options, where)}
      {
          id
          address
          name
          dao { id }
          paramsHash
          version
      }
    }   `
    const itemMap = (item: any): Scheme|null => {
      if (!options.where) { options.where = {}}

      const scheme = new Scheme({
        address: item.address,
        dao: item.dao.id,
        id: item.id,
        name: item.name,
        paramsHash: item.paramsHash,
        version: item.version
      }, context)
      return scheme
    }

    return context.getObservableList(
      query,
      itemMap,
      apolloQueryOptions
    ) as Observable<Scheme[]>
  }

  public id: Address
  public staticState: ISchemeStaticState | null = null
  public ReputationFromToken: ReputationFromTokenScheme | null = null

  constructor(idOrOpts: Address | ISchemeStaticState, public context: Arc) {
    this.context = context
    if (typeof idOrOpts === 'string') {
      this.id = idOrOpts as string
      this.id = this.id.toLowerCase()
    } else {
      this.setStaticState(idOrOpts)
      this.id = (this.staticState as ISchemeStaticState).id
    }
  }

  public setStaticState(opts: ISchemeStaticState) {
    this.staticState = opts
  }

  /**
   * fetch the static state from the subgraph
   * @return the statatic state
   */
  public async fetchStaticState(): Promise < ISchemeStaticState > {
    if (!!this.staticState) {
      return this.staticState
    } else {
      const state = await this.state({ subscribe: false}).pipe(first()).toPromise()
      if (state === null) {
        throw Error(`No scheme with id ${this.id} was found in the subgraph`)
      }
      this.staticState = {
        address: state.address,
        dao: state.dao,
        id: this.id,
        name: state.name,
        paramsHash: state.paramsHash,
        version: state.version
      }
      if (this.staticState.name ===  'ReputationFromToken') {
        this.ReputationFromToken = new ReputationFromTokenScheme(this)
      }
      return state
    }
  }

  public state(apolloQueryOptions: IApolloQueryOptions = {}): Observable<ISchemeState> {
    const query = gql`query SchemeState
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
          numberOfQueuedProposals
          numberOfPreBoostedProposals
          numberOfBoostedProposals
          uGenericSchemeParams {
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
          version
        }
      }`

    const itemMap = (item: any): ISchemeState|null => {
      if (!item) {
        return null
      }

      let name = item.name
      if (!name) {

        try {
          name = this.context.getContractInfo(item.address).name
        } catch (err) {
          if (err.message.match(/no contract/ig)) {
            // continue
          } else {
            throw err
          }
        }
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
        numberOfBoostedProposals: Number(item.numberOfBoostedProposals),
        numberOfPreBoostedProposals: Number(item.numberOfPreBoostedProposals),
        numberOfQueuedProposals: Number(item.numberOfQueuedProposals),
        paramsHash: item.paramsHash,
        schemeRegistrarParams: item.schemeRegistrarParams ? {
          voteRegisterParams: mapGenesisProtocolParams(item.schemeRegistrarParams.voteRegisterParams),
          voteRemoveParams: mapGenesisProtocolParams(item.schemeRegistrarParams.voteRemoveParams),
          votingMachine: item.schemeRegistrarParams.votingMachine
        } : null,
        uGenericSchemeParams: item.uGenericSchemeParams ? {
          contractToCall: item.uGenericSchemeParams.contractToCall,
          voteParams: mapGenesisProtocolParams(item.uGenericSchemeParams.voteParams),
          votingMachine: item.uGenericSchemeParams.votingMachine
        } : null,
        version: item.version
      }
    }
    return  this.context.getObservableObject(query, itemMap, apolloQueryOptions) as Observable<ISchemeState>
  }

    /**
     * create a new proposal in this DAO
     * TODO: move this to the schemes - we should call proposal.scheme.createProposal
     * @param  options [description ]
     * @return a Proposal instance
     */
    public createProposal(options: IProposalCreateOptions): Operation < Proposal >  {
      const observable = Observable.create(async (observer: any) => {
        let msg: string
        const context = this.context
        let createTransaction: () => any = () => null
        let map: any
        const state = await this.fetchStaticState()

        switch (state.name) {
          case 'ContributionReward':
            createTransaction  = ContributionReward.createTransaction(options, this.context)
            map = ContributionReward.createTransactionMap(options, this.context)
            break

          case 'UGenericScheme':
              createTransaction  = UGenericScheme.createTransaction(options, this.context)
              map = UGenericScheme.createTransactionMap(options, this.context)
              break

          case 'GenericScheme':
            const versionNumber = Number(state.version.split('rc.')[1])
            if (versionNumber < 23) {
              // the pre-24 " GenericScheme" contracts have beeen renamed to UGenericScheme
              createTransaction  = UGenericScheme.createTransaction(options, this.context)
              map = UGenericScheme.createTransactionMap(options, this.context)
              break
            } else {
              createTransaction  = GenericScheme.createTransaction(options, this.context)
              map = GenericScheme.createTransactionMap(options, this.context)
              break
            }

          case 'SchemeRegistrar':
            createTransaction  = SchemeRegistrar.createTransaction(options, this.context)
            map = SchemeRegistrar.createTransactionMap(options, this.context)
            break

          default:
            msg = `Unknown proposal scheme: '${state.name}'`
            throw Error(msg)
        }

        const sendTransactionObservable = context.sendTransaction(createTransaction, map)
        const sub = sendTransactionObservable.subscribe(observer)

        return () => sub.unsubscribe()
      })

      return toIOperationObservable(observable)
    }

    public proposals(
      options: IProposalQueryOptions = {},
      apolloQueryOptions: IApolloQueryOptions = {}
    ): Observable<Proposal[]> {
      if (!options.where) { options.where = {}}
      options.where.scheme = this.id
      return Proposal.search(this.context, options, apolloQueryOptions)
    }

}
