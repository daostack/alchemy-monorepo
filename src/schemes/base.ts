import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from '../arc'
// import { DAO } from './dao'
import { IGenesisProtocolParams } from '../genesisProtocol'
import { Operation, toIOperationObservable } from '../operation'
import {
  IProposalCreateOptions,
  IProposalQueryOptions, Proposal } from '../proposal'
import { Address, ICommonQueryOptions, IStateful } from '../types'
// import * as ContributionReward from './contributionReward'
// import * as ContributionRewardExt from './schemes/contributionRewardExt'
// import * as GenericScheme from './genericScheme'
import { ReputationFromTokenScheme } from './reputationFromToken'
// import * as SchemeRegistrar from './schemeRegistrar'
// import * as UGenericScheme from './uGenericScheme'

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
  contributionRewardParams?: IContributionRewardParams
  contributionRewardExtParams?: IContributionRewardExtParams
  genericSchemeParams?: IGenericSchemeParams
  schemeRegistrarParams?: {
    votingMachine: Address
    voteRemoveParams: IGenesisProtocolParams
    voteRegisterParams: IGenesisProtocolParams
  } | null
  numberOfQueuedProposals: number
  numberOfPreBoostedProposals: number
  numberOfBoostedProposals: number
  uGenericSchemeParams?: IGenericSchemeParams
  schemeParams?: IGenericSchemeParams | IContributionRewardParams | IContributionRewardExtParams | ISchemeRegisterParams
}

export interface IGenericSchemeParams {
  votingMachine: Address
  contractToCall: Address
  voteParams: IGenesisProtocolParams
}

export interface IContributionRewardParams {
  votingMachine: Address
  voteParams: IGenesisProtocolParams
}
export interface IContributionRewardExtParams {
  votingMachine: Address
  voteParams: IGenesisProtocolParams
  rewarder: Address
}

export interface ISchemeRegisterParams {
  votingMachine: Address
  contractToCall: Address
  voteParams: IGenesisProtocolParams
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
export abstract class SchemeBase implements IStateful<ISchemeState> {
  public static fragments = {
    SchemeFields: gql`
    fragment SchemeFields on ControllerScheme {
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
        id
        votingMachine
        voteParams {
          id
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
      contributionRewardExtParams {
        id
        votingMachine
        voteParams {
          id
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
        rewarder
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
    }`
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

  public setStaticState(opts: ISchemeStaticState) {
    this.staticState = opts
  }
  /**
   * create a new proposal in this scheme
   * TODO: move this to the schemes - we should call proposal.scheme.createProposal
   * @param  options [description ]
   * @return a Proposal instance
   */
  public createProposalTransaction(options: any): () => Promise<any> {
    return async () => null
  }

  public createProposalTransactionMap(): (receipt: any) => any {

    return (receipt) => receipt.result
  }
  public createProposalErrorHandler(options?: any): (err: Error) => Error|Promise<Error> {
    return (err) => err
  }

  public createProposal(options: IProposalCreateOptions): Operation<Proposal>  {
    const observable = Observable.create(async (observer: any) => {
      // let msg: string
      const context = this.context

      const createTransaction  = this.createProposalTransaction(options)
      const map = this.createProposalTransactionMap()
      const errHandler = this.createProposalErrorHandler(options)
      const sendTransactionObservable = context.sendTransaction(createTransaction, map, errHandler)
      const sub = sendTransactionObservable.subscribe(observer)

      return () => sub.unsubscribe()
    })

    return toIOperationObservable(observable)
  }

  public abstract state(apolloQueryOptions: IApolloQueryOptions): Observable < ISchemeState >

  public x() {

    // const query = gql`query SchemeState
    //   {
    //     controllerScheme (id: "${this.id}") {
    //       ...SchemeFields
    //     }
    //   }
    //   ${SchemeBase.fragments.SchemeFields}
    // `

    // const itemMap = (item: any): ISchemeState|null => {
    //   if (!item) {
    //     return null
    //   }

    //   let name = item.name
    //   if (!name) {

    //     try {
    //       name = this.context.getContractInfo(item.address).name
    //     } catch (err) {
    //       if (err.message.match(/no contract/ig)) {
    //         // continue
    //       } else {
    //         throw err
    //       }
    //     }
    //   }
    //   const uGenericSchemeParams = item.uGenericSchemeParams && {
    //     contractToCall: item.uGenericSchemeParams.contractToCall,
    //     voteParams: mapGenesisProtocolParams(item.uGenericSchemeParams.voteParams),
    //     votingMachine: item.uGenericSchemeParams.votingMachine
    //   }
    //   const contributionRewardParams = item.contributionRewardParams && {
    //     voteParams: mapGenesisProtocolParams(item.contributionRewardParams.voteParams),
    //     votingMachine: item.contributionRewardParams.votingMachine
    //   }
    //   const contributionRewardExtParams = item.contributionRewardExtParams && {
    //     rewarder: item.contributionRewardExtParams.rewarder,
    //     voteParams: mapGenesisProtocolParams(item.contributionRewardExtParams.voteParams),
    //     votingMachine: item.contributionRewardExtParams.votingMachine
    //   }
    //   const schemeRegistrarParams = item.schemeRegistrarParams && {
    //     voteRegisterParams: mapGenesisProtocolParams(item.schemeRegistrarParams.voteRegisterParams),
    //     voteRemoveParams: mapGenesisProtocolParams(item.schemeRegistrarParams.voteRemoveParams),
    //     votingMachine: item.schemeRegistrarParams.votingMachine
    //   }
    //   const genericSchemeParams = item.genericSchemeParams  && {
    //     contractToCall: item.genericSchemeParams.contractToCall,
    //     voteParams: mapGenesisProtocolParams(item.genericSchemeParams.voteParams),
    //     votingMachine: item.genericSchemeParams.votingMachine
    //   }
    //   const schemeParams = (
    //     uGenericSchemeParams || contributionRewardParams ||
    //     schemeRegistrarParams || genericSchemeParams || contributionRewardExtParams
    //   )
    //   return {
    //     address: item.address,
    //     canDelegateCall: item.canDelegateCall,
    //     canManageGlobalConstraints: item.canManageGlobalConstraints,
    //     canRegisterSchemes: item.canRegisterSchemes,
    //     canUpgradeController: item.canUpgradeController,
    //     contributionRewardExtParams,
    //     contributionRewardParams,
    //     dao: item.dao.id,
    //     genericSchemeParams,
    //     id: item.id,
    //     name,
    //     numberOfBoostedProposals: Number(item.numberOfBoostedProposals),
    //     numberOfPreBoostedProposals: Number(item.numberOfPreBoostedProposals),
    //     numberOfQueuedProposals: Number(item.numberOfQueuedProposals),
    //     paramsHash: item.paramsHash,
    //     schemeParams,
    //     schemeRegistrarParams,
    //     uGenericSchemeParams,
    //     version: item.version
    //   }
    // }
    // return  this.context.getObservableObject(query, itemMap, apolloQueryOptions) as Observable<ISchemeState>
  }

  // public xxcreateProposal(options: IProposalCreateOptions): Operation<Proposal>  {
  //   const observable = Observable.create(async (observer: any) => {
  //     let msg: string
  //     const context = this.context
  //     let createTransaction: () => any = () => null
  //     let map: any
  //     const errHandler = (err: Error) => err
  //     const state = await this.fetchStaticState()

  //     switch (state.name) {
  //       case 'ContributionReward':
  //         createTransaction  = ContributionReward.createProposal(options, this.context)
  //         map = ContributionReward.createTransactionMap(options, this.context)
  //         break
  //       case 'ContributionRewardExt':
  //         // TODO: ContributionRewardExt can also be used to create a Competition proposal
  //         // For now, we explicitly pass this in the options, but in reality (once 36-4 is released) we
  //         // should be able to sniff this: if the rewarder of the scheme is a Contribution.sol instance....
  //         // if (options.proposalType === 'competition') {
  //         //   createTransaction = Competition.createProposal(options, this.context)
  //         //   map = Competition.createTransactionMap(options, this.context),
  //         //   errHandler = Competition.createProposalErrorHandler
  //         // } else {
  //         //   createTransaction  = ContributionRewardExt.createProposal(options, this.context)
  //         //   map = ContributionRewardExt.createTransactionMap(options, this.context)
  //         // }
  //         // break

  //       case 'UGenericScheme':
  //           createTransaction  = UGenericScheme.createTransaction(options, this.context)
  //           map = UGenericScheme.createTransactionMap(options, this.context)
  //           break

  //       case 'GenericScheme':
  //         const versionNumber = Number(state.version.split('rc.')[1])
  //         if (versionNumber < 23) {
  //           // the pre-24 " GenericScheme" contracts have beeen renamed to UGenericScheme
  //           createTransaction  = UGenericScheme.createTransaction(options, this.context)
  //           map = UGenericScheme.createTransactionMap(options, this.context)
  //           break
  //         } else {
  //           createTransaction  = GenericScheme.createTransaction(options, this.context)
  //           map = GenericScheme.createTransactionMap(options, this.context)
  //           break
  //         }

  //       case 'SchemeRegistrar':
  //         createTransaction  = SchemeRegistrar.createTransaction(options, this.context)
  //         map = SchemeRegistrar.createTransactionMap(options, this.context)
  //         break

  //       default:
  //         msg = `Unknown proposal scheme: '${state.name}'`
  //         msg = `${state.name} ${state.name === 'ContributionRewardExt'}`
  //         throw Error(msg)
  //     }

  //     const sendTransactionObservable = context.sendTransaction(createTransaction, map, errHandler)
  //     const sub = sendTransactionObservable.subscribe(observer)

  //     return () => sub.unsubscribe()
  //   })

  //   return toIOperationObservable(observable)
  // }

  public proposals(
    options: IProposalQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable < Proposal[] > {
    if (!options.where) { options.where = {}}
    options.where.scheme = this.id
    return Proposal.search(this.context, options, apolloQueryOptions)
  }

}
