import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from '../arc'
import { IGenesisProtocolParams } from '../genesisProtocol'
import { Operation, toIOperationObservable } from '../operation'
import {
  IProposalCreateOptions,
  IProposalQueryOptions, Proposal } from '../proposal'
import { Address, ICommonQueryOptions, IStateful } from '../types'
import { ReputationFromTokenScheme } from './reputationFromToken'

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
  isRegistered: boolean
  paramsHash: string
  contributionRewardParams?: IContributionRewardParams
  contributionRewardExtParams?: IContributionRewardExtParams
  genericSchemeParams?: IGenericSchemeParams
  genericSchemeMultiCallParams?: IGenericSchemeMultiCallParams
  schemeRegistrarParams?: {
    votingMachine: Address
    voteRemoveParams: IGenesisProtocolParams
    voteRegisterParams: IGenesisProtocolParams
  } | null
  numberOfQueuedProposals: number
  numberOfPreBoostedProposals: number
  numberOfBoostedProposals: number
  uGenericSchemeParams?: IGenericSchemeParams
  schemeParams?: IGenericSchemeParams | IGenericSchemeMultiCallParams | IContributionRewardParams
  | IContributionRewardExtParams | ISchemeRegisterParams
}

export interface IGenericSchemeParams {
  votingMachine: Address
  contractToCall: Address
  voteParams: IGenesisProtocolParams
}

export interface IGenericSchemeMultiCallParams {
  votingMachine: Address
  schemeConstraints: Address
  contractsWhiteList: Address[]
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
    isRegistered?: boolean
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
      isRegistered
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
      genericSchemeMultiCallParams {
        votingMachine
        schemeConstraints
        contractsWhiteList
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
  public createProposalErrorHandler(options?: any): ((err: Error) => Error|Promise<Error>)|undefined {
    return undefined
    // return (err) => err
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

  public proposals(
    options: IProposalQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable < Proposal[] > {
    if (!options.where) { options.where = {}}
    options.where.scheme = this.id
    return Proposal.search(this.context, options, apolloQueryOptions)
  }

}
