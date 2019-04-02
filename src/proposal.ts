import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { DAO } from './dao'
import { Logger } from './logger'
import { Operation } from './operation'
import { IRewardQueryOptions, IRewardState, Reward } from './reward'
import { IStake, IStakeQueryOptions, Stake } from './stake'
import { Token } from './token'
import { Address, Date, ICommonQueryOptions, IStateful } from './types'
import { nullAddress } from './utils'
import { IVote, IVoteQueryOptions, Vote } from './vote'

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

export enum IProposalType {
  ContributionReward,
  GenericScheme,
  SchemeRegistrar
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
  activationTime: number
  boostedAt: Date
  boostedVotePeriodLimit: number
  contributionReward: IContributionReward|null
  confidenceThreshold: number
  createdAt: Date
  dao: DAO
  daoBountyConst: number
  descriptionHash?: string
  description?: string
  executedAt: Date
  executionState: IExecutionState
  expiresInQueueAt: Date
  genericScheme: IGenericScheme|null
  id: string
  organizationId: string
  paramsHash: string
  preBoostedAt: Date
  preBoostedVotePeriodLimit: number
  proposer: Address
  proposingRepReward: BN
  queuedVoteRequiredPercentage: number
  queuedVotePeriodLimit: number
  quietEndingPeriodBeganAt: Date
  resolvedAt: Date|null
  schemeRegistrar: ISchemeRegistrar|null
  stage: IProposalStage
  stakesFor: BN
  stakesAgainst: BN
  thresholdConst: number
  title?: string
  totalRepWhenExecuted: BN
  type: IProposalType.ContributionReward,
  url?: string
  votesFor: BN
  votesAgainst: BN
  votesCount: number
  votingMachine: Address
  winningOutcome: IProposalOutcome
}

export interface IContributionReward {
  beneficiary: Address
  externalTokenReward: BN
  externalToken: Address
  ethReward: BN
  nativeTokenReward: BN
  periods: number
  periodLength: number
  reputationReward: BN
}

export interface IGenericScheme {
  id: string
  contractToCall: Address
  callData: string
  executed: boolean
  returnValue: string
}

export interface ISchemeRegistrar {
  id: string
  schemeToRegister: Address
  schemeToRegisterParamsHash: string
  schemeToRegisterPermission: string
  schemeToRemove: string
  decision: number
  schemeRegistered: boolean
  schemeRemoved: boolean
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

    let ipfsDataToSave: object = {}

    const saveIPFSData = async () => {
      if (options.title || options.url || options.description) {
        if (!context.ipfsProvider) {
          throw Error(`No ipfsProvider set on Arc instance - cannot save data on IPFS`)
        }
        ipfsDataToSave = {
          description: options.description,
          title: options.title,
          url: options.url
        }
        if (options.descriptionHash) {
          const msg = `Proposal.create() takes a descriptionHash, or values for title, url and description; not both`
          throw Error(msg)
        }
      }
      if (ipfsDataToSave !== {}) {
        Logger.debug('Saving data on IPFS...')
        const ipfsResponse = await context.ipfs.add(Buffer.from(JSON.stringify(ipfsDataToSave)))
        const descriptionHash = ipfsResponse[0].path
        // pin the file
        await context.ipfs.pin.add(descriptionHash)
        Logger.debug(`Data saved successfully as ${options.descriptionHash}`)
        return descriptionHash
      }
    }

    let createTransaction: () => any = () => null

    // ContributionReward
    if (options.type === IProposalType.ContributionReward) {
      const contributionReward = context.getContract('ContributionReward')

      createTransaction = async () => {
        options.descriptionHash = await saveIPFSData()
        const transaction = contributionReward.methods.proposeContributionReward(
            options.dao,
            options.descriptionHash || '',
            options.reputationReward && options.reputationReward.toString() || 0,
            [
              options.nativeTokenReward && options.nativeTokenReward.toString() || 0,
              options.ethReward && options.ethReward.toString() || 0,
              options.externalTokenReward && options.externalTokenReward.toString() || 0,
              options.periodLength || 12,
              options.periods || 5
            ],
            options.externalTokenAddress || nullAddress,
            options.beneficiary
        )
        return transaction
      }

    // GenericScheme
    } else if (options.type === IProposalType.GenericScheme) {
      if (!options.callData) {
        throw new Error((`Missing argument "callData" for GenericScheme`))
      }
      if (options.value === undefined) {
        throw new Error((`Missing argument "value" for GenericScheme`))
      }
      createTransaction = async () => {
        options.descriptionHash = await saveIPFSData()

        const genericScheme = context.getContract('GenericScheme')
        const transaction = genericScheme.methods.proposeCall(
          options.dao,
          options.callData,
          options.value,
          options.descriptionHash
        )
        return transaction
      }

    // SchemeRegistrar
    } else if (options.type === IProposalType.SchemeRegistrar) {
      const msg = `IProposalType.SchemeProposal is not implemented yet`
      throw Error(msg)
    } else {
      const msg = `Unknown proposal type: "${options.type}" (did you use IProposalType.TypeOfProposal?)`
      throw Error(msg)
    }

    const map = (receipt: any) => {
      let eventName
      switch (options.type) {
        case IProposalType.ContributionReward:
          eventName = 'NewContributionProposal'
          break
        case IProposalType.GenericScheme:
          eventName = 'NewCallProposal'
          break
        case IProposalType.SchemeRegistrar:
          throw Error('SchemeRegistrar not implemented yet')
        default:
          const msg = `Unknown proposal type: "${options.type}" (did you use IProposalType.TypeOfProposal?)`
          throw Error(msg)
      }
      const proposalId = receipt.events[eventName].returnValues._proposalId
      return new Proposal(proposalId, options.dao as string, context)
    }

    return context.sendTransaction(createTransaction, map)
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
    options: IProposalQueryOptions,
    context: Arc,
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Proposal[]> {
    let where = ''

    // default options
    options.type = options.type || IProposalType.ContributionReward

    // constribut the query
    for (const key of Object.keys(options)) {
      if (key === 'stage' && options[key] !== undefined) {
        where += `stage: "${IProposalStage[options[key] as IProposalStage]}"\n`
      } else if (key === 'stage_in' && Array.isArray(options[key])) {
        const stageValues = options[key].map((stage: number) => '"' + IProposalStage[stage as IProposalStage] + '"')
        where += `stage_in: [${stageValues.join(',')}]\n`
      } else if (key === 'type') {
        const apolloKey = IProposalType[options[key]][0].toLowerCase() + IProposalType[options[key]].slice(1)
        where += `${apolloKey}_not: null\n`
      } else if (Array.isArray(options[key])) {
        // Support for operators like _in
        const values = options[key].map((value: number) => '"' + value + '"')
        where += `${key}: [${values.join(',')}]\n`
      } else {

        if (key === 'proposer' || key === 'beneficiary' || key === 'dao') {
          where += `${key}: "${(options[key] as string).toLowerCase()}"\n`
        } else {
          where += `${key}: "${options[key] as string}"\n`

        }
      }
    }

    const query = gql`
      {
        proposals(where: {
          ${where}
        }) {
          id
          dao {
            id
          }
        }
      }
    `

    return context._getObservableList(
      query,
      (r: any) => new Proposal(r.id, r.dao.id, context),
      apolloQueryOptions
    ) as Observable<Proposal[]>
  }
  /**
   * `state` is an observable of the proposal state
   */
  public context: Arc
  public dao: DAO

  constructor(public id: string, public daoAddress: Address, context: Arc) {
    this.id = id
    this.context = context
    this.dao = new DAO(daoAddress, context)
  }

  public state(): Observable<IProposalState> {
    const query = gql`
      {
        proposal(id: "${this.id}") {
          id
          accountsWithUnclaimedRewards
          activationTime
          boostedAt
          boostedVotePeriodLimit
          confidenceThreshold
          contributionReward {
            beneficiary
            ethReward
            externalToken
            externalTokenReward
            externalToken
            nativeTokenReward
            periods
            periodLength
            reputationReward
          }
          createdAt
          dao {
            id
          }
          daoBountyConst
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
          gpRewards {
            id
          }
          minimumDaoBounty
          organizationId
          paramsHash
          preBoostedAt
          preBoostedVotePeriodLimit
          proposer
          proposingRepReward
          quietEndingPeriod
          quietEndingPeriodBeganAt
          queuedVotePeriodLimit
          queuedVoteRequiredPercentage
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
          thresholdConst
          totalRepWhenExecuted
          title
          url
          votes {
            id
          }
          votesAgainst
          votesFor
          votersReputationLossRatio
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

      let contributionReward: IContributionReward|null = null
      if (item.contributionReward) {
        contributionReward = {
          beneficiary: item.contributionReward.beneficiary,
          ethReward: new BN(item.contributionReward.ethReward),
          externalToken: item.contributionReward.externalToken,
          externalTokenReward: new BN(item.contributionReward.externalTokenReward),
          nativeTokenReward: new BN(item.contributionReward.nativeTokenReward),
          periodLength: Number(item.contributionReward.periodLength),
          periods: Number(item.contributionReward.periods),
          reputationReward: new BN(item.contributionReward.reputationReward)
        }
      }

      let genericScheme: IGenericScheme|null = null
      if (item.genericScheme) {
        genericScheme = {
          callData: item.genericScheme.callData,
          contractToCall: item.genericScheme.contractToCall,
          executed: item.genericScheme.executed,
          id: item.genericScheme.id,
          returnValue: item.genericScheme.returnValue
        }
      }

      let schemeRegistrar: ISchemeRegistrar|null = null
      if (item.schemeRegistrar) {
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
      }
      return {
        accountsWithUnclaimedRewards: item.accountsWithUnclaimedRewards,
        activationTime: Number(item.activationTime),
        boostedAt: Number(item.boostedAt),
        boostedVotePeriodLimit: Number(item.boostedVotePeriodLimit),
        confidenceThreshold: Number(item.confidenceThreshold),
        contributionReward: contributionReward || null,
        createdAt: Number(item.createdAt),
        dao: new DAO(item.dao.id, this.context),
        daoBountyConst: item.daoBountyConst,
        description: item.description,
        descriptionHash: item.descriptionHash,
        executedAt: item.executedAt,
        executionState: IExecutionState[item.executionState] as any,
        expiresInQueueAt: Number(item.expiresInQueueAt),
        genericScheme,
        id: item.id,
        organizationId: item.organizationId,
        paramsHash: item.paramsHash,
        preBoostedAt: Number(item.preBoostedAt),
        preBoostedVotePeriodLimit: Number(item.preBoostedVotePeriodLimit),
        proposer: item.proposer,
        proposingRepReward: new BN(item.proposingRepReward),
        queuedVotePeriodLimit: Number(item.queuedVotePeriodLimit),
        queuedVoteRequiredPercentage: Number(item.queuedVoteRequiredPercentage),
        quietEndingPeriodBeganAt: item.quietEndingPeriodBeganAt,
        resolvedAt: item.resolvedAt !== undefined ? Number(item.resolvedAt) : null,
        schemeRegistrar,
        stage: IProposalStage[item.stage] as any,
        stakesAgainst: new BN(item.stakesAgainst),
        stakesFor: new BN(item.stakesFor),
        thresholdConst: Number(item.thresholdConst),
        title: item.title,
        totalRepWhenExecuted: new BN(item.totalRepWhenExecuted),
        type: IProposalType.ContributionReward,
        url: item.url,
        votesAgainst: new BN(item.votesAgainst),
        votesCount: item.votes.length,
        votesFor: new BN(item.votesFor),
        votingMachine: item.votingMachine,
        winningOutcome: IProposalOutcome[item.winningOutcome] as any
      }
    }

    return this.context._getObservableObject(query, itemMap) as Observable<IProposalState>
  }

  /**
   * [votingMachine description]
   * @return [description]
   */
  public votingMachine() {
    return this.context.getContract('GenesisProtocol')
  }

  public redeemerContract() {
    return this.context.getContract('Redeemer')
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    options.proposal = this.id
    return Vote.search(options, this.context)
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
      nullAddress
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
        const prop = await votingMachine.methods.proposals(proposal.id).call()
        if (prop.proposer === nullAddress ) {
          return new Error(`Unknown proposal with id ${proposal.id}`)
        }
        const contributionReward = this.context.getContract('ContributionReward')
        const proposalDataOnChain = await contributionReward.methods
          .organizationsProposals(this.dao.address, this.id).call()

        // requirement from ContributionReward.sol
        // require(organizationsProposals[address(proposal.avatar)][_proposalId].executionTime == 0);
        if (Number(proposalDataOnChain.executionTime) !== 0) {
          const msg = `proposal ${proposal.id} already executed`
          throw Error(msg)
        }
      }
      // if we have found no known error, we return the original error
      return error
    }
    return this.context.sendTransaction(voteMethod, map, errorHandler)
  }

  public stakingToken() {
    return new Token(this.context.getContract('GEN').options.address, this.context)
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    options.proposal = this.id
    return Stake.search(options, this.context)
  }

  public stake(outcome: IProposalOutcome, amount: BN ): Operation<Stake> {
    const stakeMethod = this.votingMachine().methods.stake(
      this.id,  // proposalId
      outcome, // a value between 0 to and the proposal number of choices.
      amount.toString() // the amount of tokens to stake
    )

    const map = (receipt: any) => { // map extracts Stake instance from receipt
        const event = receipt.events.Stake
        if (!event) {
          // for some reason, a transaction was mined but no error was raised before
          throw new Error(`Error voting: no "Stake" event was found - ${Object.keys(receipt.events)}`)
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
        const prop = await this.votingMachine().methods.proposals(proposal.id).call()
        if (prop.proposer === nullAddress ) {
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

  public rewards(options: IRewardQueryOptions = {}): Observable<IRewardState[]> {
    options.proposal = this.id
    return Reward.search(options, this.context)
  }

  /**
   * [claimRewards description] Execute the proposal and distribute the rewards
   * to the beneficiary.
   * This uses the Redeemer.sol helper contract
   * @param  beneficiary Addresss of the beneficiary, optional, defaults to the defaultAccount
   * @return  an Operation
   */
  public claimRewards(beneficiary?: Address): Operation<boolean> {
    // const transaction = this.votingMachine().methods.redeem(this.id, account)
    if (!beneficiary) {
      beneficiary = this.context.web3.eth.defaultAccount
    }
    const transaction = this.redeemerContract().methods.redeem(
      this.id,
      this.dao.address,
      beneficiary
    )
    return this.context.sendTransaction(transaction, () => true)
  }

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
      let msg: string = ''
      const contributionReward = this.context.getContract('ContributionReward')
      const proposalDataOnChain = await contributionReward.methods
        .organizationsProposals(this.dao.address, this.id).call()

      // requirement from ContributionReward.sol
      // require(organizationsProposals[address(proposal.avatar)][_proposalId].executionTime == 0);
      if (Number(proposalDataOnChain.executionTime) !== 0) {
        msg = `proposal already executed`
      }

      // requirement from ContributionReward.sol
      // require(organizationsProposals[address(proposal.avatar)][_proposalId].beneficiary != address(0));
      if (proposalDataOnChain.periodLength === '0' && proposalDataOnChain.numberOfPeriods === '0') {
        msg = `A proposal with id ${this.id} does not exist`
      } else if (proposalDataOnChain.beneficiary === nullAddress) {
        msg = `beneficiary is ${nullAddress}`
      }

      if (msg) {
        return Error(`Proposal execution failed: ${msg}`)
      } else {
        return err
      }

    }
    return this.context.sendTransaction(transaction, map, errorHandler)
  }
}

enum ProposalQuerySortOptions {
  resolvesAt = 'resolvesAt',
  preBoostedAt = 'preBoostedAt'
}

export interface IProposalQueryOptions extends ICommonQueryOptions {
  active?: boolean
  boosted?: boolean
  proposer?: Address
  proposalId?: string
  stage?: IProposalStage
  orderBy?: ProposalQuerySortOptions
  // the options above should be ok for the current alchemy; will add more options as needed
  executedAfter?: Date
  executedBefore?: Date
  [key: string]: any
}

export interface IProposalCreateOptions {
  beneficiary: Address
  dao?: Address
  description?: string
  descriptionHash?: string
  callData?: string // for GenericSchemeProposal
  nativeTokenReward?: BN // for ContributionRewardProposal
  reputationReward?: BN // for ContributionRewardProposal
  ethReward?: BN // for ContributionRewardProposal
  externalTokenReward?: BN // for ContributionRewardProposal
  externalTokenAddress?: Address // for ContributionRewardProposal
  periodLength?: number // for ContributionRewardProposal
  periods?: any // for ContributionRewardProposal
  title?: string
  type: number
  url?: string
  value?: number // for GenericSchemeProposal
}
