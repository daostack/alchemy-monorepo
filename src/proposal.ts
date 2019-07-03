import gql from 'graphql-tag'
const Web3 = require('web3')
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { DAO } from './dao'
import { Operation } from './operation'
import { IQueueState } from './queue'
import { IRewardQueryOptions, Reward } from './reward'
import { ISchemeState } from './scheme'
import { Scheme } from './scheme'
import * as ContributionReward from './schemes/contributionReward'
import * as GenericScheme from './schemes/genericScheme'
import * as SchemeRegistrar from './schemes/schemeRegistrar'
import { IStake, IStakeQueryOptions, Stake } from './stake'
import { Address, Date, ICommonQueryOptions, IStateful } from './types'
import { BN } from './utils'
import { createGraphQlQuery, NULL_ADDRESS, realMathToNumber } from './utils'
import { IVote, IVoteQueryOptions, Vote } from './vote'

export const IProposalType = {
  ...ContributionReward.IProposalType,
  ...GenericScheme.IProposalType,
  ...SchemeRegistrar.IProposalType
}

type IProposalType = (
  ContributionReward.IProposalType |
  GenericScheme.IProposalType |
  SchemeRegistrar.IProposalType
)

export enum IProposalOutcome {
  None,
  Pass,
  Fail
}

export enum IProposalStage {
  ExpiredInQueue,
  Executed,
  Queued,
  PreBoosted,
  Boosted,
  QuietEndingPeriod
}

export enum IExecutionState {
  None,
  QueueBarCrossed,
  QueueTimeOut,
  PreBoostedBarCrossed,
  BoostedTimeOut,
  BoostedBarCrossed
}

export interface IProposalState {
  accountsWithUnclaimedRewards: Address[],
  boostedAt: Date
  contributionReward: ContributionReward.IContributionReward|null
  confidenceThreshold: number
  createdAt: Date
  dao: DAO
  descriptionHash?: string
  description?: string
  downStakeNeededToQueue: typeof BN
  executedAt: Date
  executionState: IExecutionState
  expiresInQueueAt: Date
  genericScheme: GenericScheme.IGenericScheme|null
  genesisProtocolParams: {
    activationTime: number
    boostedVotePeriodLimit: number
    daoBountyConst: number // ?
    limitExponentValue: number
    minimumDaoBounty: typeof BN // in GEN
    preBoostedVotePeriodLimit: number
    proposingRepReward: typeof BN // in REP
    queuedVoteRequiredPercentage: number
    queuedVotePeriodLimit: number // in seconds (?)
    quietEndingPeriod: number
    thresholdConst: number
    votersReputationLossRatio: number // in 1000's
  }
  id: string
  organizationId: string
  paramsHash: string
  preBoostedAt: Date
  proposal: Proposal
  proposer: Address
  queue: IQueueState
  quietEndingPeriodBeganAt: Date
  schemeRegistrar: SchemeRegistrar.ISchemeRegistrar|null
  resolvedAt: Date
  scheme: ISchemeState
  stage: IProposalStage
  stakesFor: typeof BN
  stakesAgainst: typeof BN
  title?: string
  totalRepWhenCreated: typeof BN
  totalRepWhenExecuted: typeof BN
  type: IProposalType,
  upstakeNeededToPreBoost: typeof BN
  url?: string
  votesFor: typeof BN
  votesAgainst: typeof BN
  votesCount: number
  voteOnBehalf: Address
  votingMachine: Address
  winningOutcome: IProposalOutcome
}

export class Proposal implements IStateful<IProposalState> {

  /**
   * Proposal.create() creates a new proposal
   * @param  options cf. IProposalCreateOptions
   * @param  context [description]
   * @return  an observable that streams the various states
   */
  public static create(options: IProposalCreateOptions, context: Arc): Operation<Proposal> {

    if (!options.dao) {
      throw Error(`Proposal.create(options): options must include an address for "dao"`)
    }
    if (!options.scheme) {
      throw Error(`Proposal.create(options): options must include an address for "scheme"`)
    }

    let schemeName: string
    try {
      schemeName = context.getContractInfo(options.scheme).name
    } catch (err) {
      if (err.message.match(/is known/)) {
        throw new Error(`Unknown scheme at ${options.scheme} - cannot create a proposal`)
      } else {
        throw err
      }
    }

    const scheme = new Scheme(
      options.scheme, // id
      options.dao, // dao
      schemeName,
      options.scheme, // address
      context
    )
    return scheme.createProposal(options)
  }

  /**
   * Search for proposals
   * @param  options            Search options, must implemeent IProposalQueryOptions
   * @param  context            An instance of Arc
   * @param  apolloQueryOptions [description]
   * @return                    An observable of lists of results
   *
   * For example:
   *    Proposal.search({ stage: IProposalStage.Queued})
   */
  public static search(
    context: Arc,
    options: IProposalQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Proposal[]> {
    let where = ''

    if (!options.where) { options.where = {} }

    for (const key of Object.keys(options.where)) {
      const value = options.where[key]
      if (key === 'stage' && value !== undefined) {
        where += `stage: "${IProposalStage[value as IProposalStage]}"\n`
      } else if (key === 'stage_in' && Array.isArray(value)) {
        const stageValues = value.map((stage: number) => '"' + IProposalStage[stage as IProposalStage] + '"')
        where += `stage_in: [${stageValues.join(',')}]\n`
      } else if (key === 'type') {
        // TODO: we are not distinguishing between the schemeregisterpropose
        // and SchemeRegistrarProposeToRemove proposals
        if (value.toString().includes('SchemeRegistrar')) {
          where += `schemeRegistrar_not: null\n`
        } else {
          if (IProposalType[value] === undefined) {
            throw Error(`Unknown value for "type" in proposals query: ${value}`)
          }
          const apolloKey = IProposalType[value][0].toLowerCase() + IProposalType[value].slice(1)
          where += `${apolloKey}_not: null\n`
        }
      } else if (Array.isArray(options.where[key])) {
        // Support for operators like _in
        const values = options.where[key].map((val: number) => '"' + val + '"')
        where += `${key}: [${values.join(',')}]\n`
      } else {
        if (key === 'proposer' || key === 'beneficiary' || key === 'dao') {
          where += `${key}: "${(options.where[key] as string).toLowerCase()}"\n`
        } else {
          where += `${key}: "${options.where[key]}"\n`
        }
      }
    }

    const query = gql`
      {
        proposals ${createGraphQlQuery(options, where)} {
          id
          dao {
            id
          }
          votingMachine
          scheme {
            id
            address
          }
        }
      }
    `

    return context.getObservableList(
      query,
      (r: any) => new Proposal(r.id, r.dao.id, r.scheme.address, r.votingMachine, context),
      apolloQueryOptions
    ) as Observable<Proposal[]>
  }

  public context: Arc
  public dao: DAO
  private votingMachineContract: typeof Web3.eth.Contract

  constructor(
    public id: string,
    daoAddress: Address,
    public schemeAddress: Address,
    public votingMachineAddress: Address,
    context: Arc
  ) {
    if (!schemeAddress) {
      throw Error('No schemeAddress provided..')
    }
    this.id = id
    this.context = context
    this.dao = new DAO(daoAddress, context)
    this.votingMachineContract = this.context.getContract(this.votingMachineAddress)
  }
  /**
   * `state` is an observable of the proposal state
   */
  public state(): Observable<IProposalState> {
    const query = gql`
      {
        proposal(id: "${this.id}") {
          id
          accountsWithUnclaimedRewards
          boostedAt
          confidenceThreshold
          contributionReward {
            id
            beneficiary
            ethReward
            externalToken
            externalTokenReward
            externalToken
            nativeTokenReward
            periods
            periodLength
            reputationReward
            alreadyRedeemedReputationPeriods
            alreadyRedeemedExternalTokenPeriods
            alreadyRedeemedNativeTokenPeriods
            alreadyRedeemedEthPeriods
          }
          createdAt
          dao {
            id
            schemes {
              id
              address
            }
          }
          description
          descriptionHash
          executedAt
          executionState
          expiresInQueueAt
          genericScheme {
            id
            contractToCall
            callData
            executed
            returnValue
          }
          genesisProtocolParams {
            activationTime
            boostedVotePeriodLimit
            daoBountyConst
            limitExponentValue
            minimumDaoBounty
            preBoostedVotePeriodLimit
            proposingRepReward
            queuedVotePeriodLimit
            queuedVoteRequiredPercentage
            quietEndingPeriod
            thresholdConst
            votersReputationLossRatio
          }
          gpRewards {
            id
          }
          scheme {
            id
            paramsHash
            name
            address
            canDelegateCall
            canManageGlobalConstraints
            canRegisterSchemes
            canUpgradeController
            name
          }
          gpQueue {
            id
            threshold
            votingMachine
          }
          organizationId
          preBoostedAt
          proposer
          quietEndingPeriodBeganAt
          schemeRegistrar {
            id
            schemeToRegister
            schemeToRegisterParamsHash
            schemeToRegisterPermission
            schemeToRemove
            decision
            schemeRegistered
            schemeRemoved
          }
          stage
          stakes {
            id
          }
          stakesFor
          stakesAgainst
          totalRepWhenCreated
          totalRepWhenExecuted
          title
          url
          votes {
            id
          }
          votesAgainst
          votesFor
          votingMachine
          winningOutcome
        }
      }
    `

    const itemMap = (item: any): IProposalState|null => {
      if (item === null) {
        // no proposal was found - we return null
        return null
      }

      let contributionReward: ContributionReward.IContributionReward|null = null
      let type: IProposalType
      let genericScheme: GenericScheme.IGenericScheme|null = null
      let schemeRegistrar: SchemeRegistrar.ISchemeRegistrar|null = null
      if (item.contributionReward) {
        type = IProposalType.ContributionReward
        contributionReward = {
          alreadyRedeemedEthPeriods: Number(item.contributionReward.alreadyRedeemedEthPeriods),
          alreadyRedeemedExternalTokenPeriods: Number(item.contributionReward.alreadyRedeemedExternalTokenPeriods),
          alreadyRedeemedNativeTokenPeriods: Number(item.contributionReward.alreadyRedeemedNativeTokenPeriods),
          alreadyRedeemedReputationPeriods: Number(item.contributionReward.alreadyRedeemedReputationPeriods),
          beneficiary: item.contributionReward.beneficiary,
          ethReward: new BN(item.contributionReward.ethReward),
          externalToken: item.contributionReward.externalToken,
          externalTokenReward: new BN(item.contributionReward.externalTokenReward),
          nativeTokenReward: new BN(item.contributionReward.nativeTokenReward),
          periodLength: Number(item.contributionReward.periodLength),
          periods: Number(item.contributionReward.periods),
          reputationReward: new BN(item.contributionReward.reputationReward)
        }
      } else if (item.genericScheme) {
        type = IProposalType.GenericScheme
        genericScheme = {
          callData: item.genericScheme.callData,
          contractToCall: item.genericScheme.contractToCall,
          executed: item.genericScheme.executed,
          id: item.genericScheme.id,
          returnValue: item.genericScheme.returnValue
        }
      } else if (item.schemeRegistrar) {
        if (item.schemeRegistrar.schemeToRegister) {
          // TODO: this is failing bc of https://github.com/daostack/subgraph/issues/224
          if (item.dao.schemes.map((s: any) => s.address.toLowerCase())
            .includes(item.schemeRegistrar.schemeToRegister.toLowerCase())) {
            type = IProposalType.SchemeRegistrarEdit
          } else {
            type = IProposalType.SchemeRegistrarAdd
          }
        } else if (item.schemeRegistrar.schemeToRemove) {
          type = IProposalType.SchemeRegistrarRemove
        } else {
          throw Error(`Unknown proposal type: schemeRegistrar without a scheme to register or to remove`)
        }
        schemeRegistrar =  {
          decision: item.schemeRegistrar.decision,
          id: item.schemeRegistrar.id,
          schemeRegistered: item.schemeRegistrar.schemeRegistered,
          schemeRemoved: item.schemeRegistrar.schemeRemoved,
          schemeToRegister: item.schemeRegistrar.schemeToRegister,
          schemeToRegisterParamsHash: item.schemeRegistrar.schemeToRegisterParamsHash,
          schemeToRegisterPermission: item.schemeRegistrar.schemeToRegisterPermission,
          schemeToRemove: item.schemeRegistrar.schemeToRemove
        }
      } else {
        throw Error(`Unknown proposal type`)
      }
      // the  formule to enter into the preboosted state is:
      // (S+/S-) > AlphaConstant^NumberOfBoostedProposal.
      // (stakesFor/stakesAgainst) > gpQueue.threshold
      const stage: any = IProposalStage[item.stage]
      const threshold = realMathToNumber(new BN(item.gpQueue.threshold))
      const stakesFor = new BN(item.stakesFor)
      const stakesAgainst = new BN(item.stakesAgainst)

      // upstakeNeededToPreBoost is the amount of tokens needed to upstake to move to the preboost queue
      // this is only non-zero for Queued proposals
      // note that the number can be negative!
      let upstakeNeededToPreBoost: typeof BN = new BN(0)
      const PRECISION = Math.pow(2, 40)
      if (stage === IProposalStage.Queued) {

        upstakeNeededToPreBoost = new BN(threshold * PRECISION)
          .mul(stakesAgainst)
          .div(new BN(PRECISION))
          .sub(stakesFor)
      }
      // upstakeNeededToPreBoost is the amount of tokens needed to upstake to move to the Queued queue
      // this is only non-zero for Preboosted proposals
      // note that the number can be negative!
      let downStakeNeededToQueue: typeof BN = new BN(0)
      if (stage === IProposalStage.PreBoosted) {
        downStakeNeededToQueue = stakesFor.mul(new BN(PRECISION))
          .div(new BN(threshold * PRECISION))
          .sub(stakesAgainst)
      }
      const thresholdConst = realMathToNumber(new BN(item.genesisProtocolParams.thresholdConst))
      const scheme = item.scheme
      const schemeName = scheme.name || this.context.getContractInfo(scheme.address).name
      const gpQueue = item.gpQueue

      const schemeState: ISchemeState = {
        address: scheme.address,
        canDelegateCall: scheme.canDelegateCall,
        canManageGlobalConstraints: scheme.canManageGlobalConstraints,
        canRegisterSchemes: scheme.canRegisterSchemes,
        canUpgradeController: scheme.canUpgradeController,
        dao: item.dao.id,
        id: scheme.id,
        name: schemeName,
        paramsHash: scheme.paramsHash
      }
      const queueState: IQueueState = {
        dao: item.dao.id,
        id: gpQueue.id,
        name: schemeName,
        scheme: schemeState,
        threshold,
        votingMachine: gpQueue.votingMachine
      }

      return {
        accountsWithUnclaimedRewards: item.accountsWithUnclaimedRewards,
        boostedAt: Number(item.boostedAt),
        confidenceThreshold: Number(item.confidenceThreshold),
        contributionReward,
        createdAt: Number(item.createdAt),
        dao: new DAO(item.dao.id, this.context),
        description: item.description,
        descriptionHash: item.descriptionHash,
        downStakeNeededToQueue,
        executedAt: Number(item.executedAt),
        executionState: IExecutionState[item.executionState] as any,
        expiresInQueueAt: Number(item.expiresInQueueAt),
        genericScheme,
        genesisProtocolParams: {
          activationTime: Number(item.genesisProtocolParams.activationTime),
          boostedVotePeriodLimit: Number(item.genesisProtocolParams.boostedVotePeriodLimit),
          daoBountyConst: Number(item.genesisProtocolParams.daoBountyConst),
          limitExponentValue: Number(item.genesisProtocolParams.limitExponentValue),
          minimumDaoBounty: new BN(item.genesisProtocolParams.minimumDaoBounty),
          preBoostedVotePeriodLimit: Number(item.genesisProtocolParams.preBoostedVotePeriodLimit),
          proposingRepReward: new BN(item.genesisProtocolParams.proposingRepReward),
          queuedVotePeriodLimit: Number(item.genesisProtocolParams.queuedVotePeriodLimit),
          queuedVoteRequiredPercentage: Number(item.genesisProtocolParams.queuedVoteRequiredPercentage),
          quietEndingPeriod: Number(item.genesisProtocolParams.quietEndingPeriod),
          thresholdConst,
          votersReputationLossRatio: Number(item.genesisProtocolParams.votersReputationLossRatio)
        },
        id: item.id,
        organizationId: item.organizationId,
        paramsHash: item.paramsHash,
        preBoostedAt: Number(item.preBoostedAt),
        proposal: this,
        proposer: item.proposer,
        queue: queueState,
        quietEndingPeriodBeganAt: Number(item.quietEndingPeriodBeganAt),
        resolvedAt: item.resolvedAt !== undefined ? Number(item.resolvedAt) : 0,
        scheme: schemeState,
        schemeRegistrar,
        stage,
        stakesAgainst,
        stakesFor,
        title: item.title,
        totalRepWhenCreated: new BN(item.totalRepWhenCreated),
        totalRepWhenExecuted: new BN(item.totalRepWhenExecuted),
        type,
        upstakeNeededToPreBoost,
        url: item.url,
        voteOnBehalf: item.voteOnBehalf,
        votesAgainst: new BN(item.votesAgainst),
        votesCount: item.votes.length,
        votesFor: new BN(item.votesFor),
        votingMachine: item.votingMachine,
        winningOutcome: IProposalOutcome[item.winningOutcome] as any
      }
    }

    const result = this.context.getObservableObject(query, itemMap) as Observable<IProposalState>
    return result
  }

  public scheme() {
    return this.context.getContract(this.schemeAddress)
  }
  /**
   * [votingMachine description]
   * @return a web3 Contract instance
   */
  public votingMachine() {
    return this.votingMachineContract
  }

  /**
   * [redeemerContract description]
   * @return a web3 Contract instance
   */
  public redeemerContract() {
    const contractInfoOfScheme = this.context.getContractInfo(this.schemeAddress)
    const contractInfo = this.context.getContractInfoByName('Redeemer', contractInfoOfScheme.version)
    return this.context.getContract(contractInfo.address)
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    if (!options.where) { options.where = {}}
    options.where.proposal = this.id
    return Vote.search(this.context, options)
  }

  /**
   * Vote for this proposal
   * @param  outcome one of IProposalOutcome.Pass (0) or IProposalOutcome.FAIL (1)
   * @param  amount the amount of reputation to vote with. Defaults to 0 - in that case,
   *  all the sender's rep will be used
   * @return  an observable Operation<Vote>
   */
  public vote(outcome: IProposalOutcome, amount: number = 0): Operation<Vote|null> {

    const votingMachine = this.votingMachine()

    const voteMethod = votingMachine.methods.vote(
      this.id,  // proposalId
      outcome, // a value between 0 to and the proposal number of choices.
      amount.toString(), // amount of reputation to vote with . if _amount == 0 it will use all voter reputation.
      NULL_ADDRESS
    )

    const map = (receipt: any) => {
      const event = receipt.events.VoteProposal
      if (!event) {
        // no vote was cast
        return null
      }
      const voteId = undefined

      return new Vote(
        voteId,
        event.returnValues._voter,
        // createdAt is "about now", but we cannot calculate the data that will be indexed by the subgraph
        0, // createdAt -
        outcome,
        event.returnValues._reputation, // amount
        this.id, // proposalID
        this.dao.address
      )
    }
    const errorHandler = async (error: Error) => {
      if (error.message.match(/revert/)) {
        const proposal = this
        const proposalDataFromVotingMachine = await votingMachine.methods.proposals(proposal.id).call()
        if (proposalDataFromVotingMachine.proposer === NULL_ADDRESS ) {
          return Error(`Error in vote(): unknown proposal with id ${proposal.id}`)
        }

        if (proposalDataFromVotingMachine.state === '2') {
          const msg = `Error in vote(): proposal ${proposal.id} already executed`
          return Error(msg)
        }
      }
      // if we have found no known error, we return the original error
      return error
    }
    return this.context.sendTransaction(voteMethod, map, errorHandler)
  }

  public stakingToken() {
    return this.context.GENToken()
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    if (!options.where) { options.where = {}}
    options.where.proposal = this.id
    return Stake.search(this.context, options)
  }

  public stake(outcome: IProposalOutcome, amount: typeof BN ): Operation<Stake> {
    const stakeMethod = this.votingMachine().methods.stake(
      this.id,  // proposalId
      outcome, // a value between 0 to and the proposal number of choices.
      amount.toString() // the amount of tokens to stake
    )

    const map = (receipt: any) => { // map extracts Stake instance from receipt
        const event = receipt.events.Stake
        if (!event) {
          // for some reason, a transaction was mined but no error was raised before
          throw new Error(`Error staking: no "Stake" event was found - ${Object.keys(receipt.events)}`)
        }
        const stakeId = undefined

        return new Stake(
          stakeId,
          event.returnValues._staker,
          // createdAt is "about now", but we cannot calculate the data that will be indexed by the subgraph
          undefined,
          outcome,
          event.returnValues._reputation, // amount
          this.id // proposalID
        )
    }

    const errorHandler =  async (error: Error) => {
      if (error.message.match(/revert/)) {
        const proposal = this
        const stakingToken = this.stakingToken()
        // TODO: check if we have the correct stakingTokenAddress (should not happen, but ok)
        // const stakingTokenAddress = this.votingMachine().methods.stakingToken().call()
        const prop = await this.votingMachine().methods.proposals(proposal.id).call()
        if (prop.proposer === NULL_ADDRESS ) {
          return new Error(`Unknown proposal with id ${proposal.id}`)
        }

        // staker has sufficient balance
        const defaultAccount = await this.context.getAccount().pipe(first()).toPromise()
        const balance = new BN(await stakingToken.contract().methods.balanceOf(defaultAccount).call())
        const amountBN = new BN(amount)
        if (balance.lt(amountBN)) {
          const msg = `Staker ${defaultAccount} has insufficient balance to stake ${amount.toString()}
            (balance is ${balance.toString()})`
          return new Error(msg)
        }

        // staker has approved the token spend
        const allowance = new BN(await stakingToken.contract().methods.allowance(
          defaultAccount, this.votingMachine().options.address
        ).call())
        if (allowance.lt(amountBN)) {
          return new Error(`Staker has insufficient allowance to stake ${amount.toString()}
            (allowance is ${allowance.toString()})`)
        }
      }
      // if we have found no known error, we return the original error
      return error
    }
    return this.context.sendTransaction(stakeMethod, map, errorHandler)
  }

  public rewards(options: IRewardQueryOptions = {}): Observable<Reward[]> {
    if (!options.where) { options.where = {}}
    options.where.proposal = this.id
    return Reward.search(this.context, options)
  }

  /**
   * [claimRewards description] Execute the proposal and distribute the rewards
   * to the beneficiary.
   * This uses the Redeemer.sol helper contract
   * @param  beneficiary Addresss of the beneficiary, optional,
   *    if undefined will only redeem the ContributionReward rewards
   * @return  an Operation
   */
  public claimRewards(beneficiary?: Address): Operation<boolean> {
    if (!beneficiary) {
      beneficiary = NULL_ADDRESS
    }
    const transaction = this.redeemerContract().methods.redeem(
      this.id,
      this.dao.address,
      beneficiary
    )
    return this.context.sendTransaction(transaction, () => true)
  }

  /**
   * calll the 'execute()' function on the votingMachine.
   * the main purpose of this function is to set the stage of the proposals
   * this call may (or may not) "execute" the proposal itself (i.e. do what the proposal proposes)
   * @return an Operation that, when sucessful, wil lcontain the receipt of the transaction
   */
  public execute(): Operation<any> {
    const transaction = this.votingMachine().methods.execute(this.id)
    const map = (receipt: any) => {
      if (Object.keys(receipt.events).length  === 0) {
        // this does not mean that anything failed
        return receipt
      } else {
        return receipt
      }
    }
    const errorHandler = async (err: Error) => {
      const votingMachine = this.votingMachine()
      const proposalDataFromVotingMachine = await votingMachine.methods.proposals(this.id).call()

      if (proposalDataFromVotingMachine.callbacks === NULL_ADDRESS) {
        const msg = `Error in proposal.execute(): A proposal with id ${this.id} does not exist`
        return Error(msg)
      } else if (proposalDataFromVotingMachine.state === '2') {
        const msg = `Error in proposal.execute(): proposal ${this.id} already executed`
        return Error(msg)
      }
      return err
    }
    return this.context.sendTransaction(transaction, map, errorHandler)
  }
}

enum ProposalQuerySortOptions {
  resolvesAt = 'resolvesAt',
  preBoostedAt = 'preBoostedAt'
}

export interface IProposalQueryOptions extends ICommonQueryOptions {
  where?: {
    accountsWithUnclaimedRewards_contains?: Address[]
    active?: boolean
    boosted?: boolean
    dao?: Address
    expiresInQueueAt?: Date
    expiresInQueueAt_gte?: Date
    expiresInQueueAt_lte?: Date
    expiresInQueueAt_gt?: Date
    executedAfter?: Date
    executedBefore?: Date
    id?: string
    proposer?: Address
    proposalId?: string
    stage?: IProposalStage
    stage_in?: IProposalStage[]
    scheme?: Address
    orderBy?: ProposalQuerySortOptions
    type?: IProposalType
    [key: string]: any|undefined
  }
}

interface IProposalBaseCreateOptions {
  dao: Address
  description?: string
  descriptionHash?: string
  title?: string
  scheme: Address
  url?: string
}

export type IProposalCreateOptions = (
  (IProposalBaseCreateOptions & GenericScheme.IProposalCreateOptionsGS ) |
  (IProposalBaseCreateOptions & SchemeRegistrar.IProposalCreateOptionsSR) |
  (IProposalBaseCreateOptions & ContributionReward.IProposalCreateOptionsCR)
)
