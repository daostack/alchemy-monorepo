import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
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

export enum ProposalOutcome {
  None,
  Pass,
  Fail
}

export enum ProposalStage {
  ExpiredInQueue,
  Executed,
  Queued,
  PreBoosted,
  Boosted,
  QuietEndingPeriod
}

export interface IProposalState {
  id: string
  beneficiary: Address
  boostedAt: Date
  boostingThreshold: number
  boostedVotePeriodLimit: number
  // confidence: number
  createdAt: Date
  dao: DAO
  description?: string
  ethReward: BN
  executedAt: Date
  externalTokenReward: BN
  descriptionHash?: string
  nativeTokenReward: BN
  preBoostedVotePeriodLimit: number
  proposer: Address
  proposingRepReward: BN
  quietEndingPeriodBeganAt: Date
  reputationReward: BN
  resolvedAt: Date
  stage: ProposalStage
  stakesFor: BN
  stakesAgainst: BN
  totalRepWhenExecuted: BN
  title?: string
  url?: string
  votesFor: BN
  votesAgainst: BN
  winningOutcome: ProposalOutcome
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
        const msg = `Proposal.create() takes a descriptionHash, or a value for title, url and description, but not both`
        throw Error(msg)
      }
    }
    const contributionReward = context.getContract('ContributionReward')

    async function createTransaction() {
      if (ipfsDataToSave !== {}) {
        Logger.debug('Saving data on IPFS...')
        const ipfsResponse = await context.ipfs.add(Buffer.from(JSON.stringify(ipfsDataToSave)))
        options.descriptionHash = ipfsResponse[0].path
        Logger.debug(`Data saved successfully as ${options.descriptionHash}`)
      }

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

    const map = (receipt: any) => {
      const proposalId = receipt.events.NewContributionProposal.returnValues._proposalId
      return new Proposal(proposalId, options.dao as string, context)
    }

    return context.sendTransaction(createTransaction, map)
  }

  public static search(
    options: IProposalQueryOptions,
    context: Arc,
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Proposal[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      if (key === 'stage' && options[key] !== undefined) {
        where += `${key}: ${ProposalStage[options[key] as ProposalStage]},\n`
      } else {
        where += `${key}: "${options[key] as string}",`
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
  public state: Observable<IProposalState> = of()
  public context: Arc
  public dao: DAO

  constructor(public id: string, public daoAddress: Address, context: Arc) {
    this.id = id
    this.context = context
    this.dao = new DAO(daoAddress, context)

    const query = gql`
      {
        proposal(id: "${id}") {
          id
          activationTime
          boostedAt
          boostedVotePeriodLimit
          createdAt
          dao {
            id
          }
          daoBountyConst
          description
          descriptionHash
          ethReward
          externalTokenReward
          executedAt
          proposer
          quietEndingPeriodBeganAt
          queuedVotePeriodLimit
          queuedVoteRequiredPercentage
          rewards {
            id
          }
          stage
          stakes {
            id
          }
          stakesFor
          stakesAgainst
          totalRepWhenExecuted
          title
          url
          votes {
            id
          }
          votesFor
          votesAgainst
          winningOutcome
          preBoostedVotePeriodLimit
          thresholdConst
          limitExponentValue
          quietEndingPeriod
          proposingRepReward
          votersReputationLossRatio
          minimumDaoBounty
          externalToken
          voteOnBehalf
          beneficiary
          reputationReward
          nativeTokenReward
          periods
          periodLength
        }
      }
    `

    const itemMap = (item: any) => {
      if (item === null) {
        // no proposal was found - we return null
        return null
      }

      const proposalStage = ProposalStage[item.stage]

      return {
        beneficiary: item.beneficiary,
        boostedAt: Number(item.boostedAt),
        boostedVotePeriodLimit: Number(item.boostedVotePeriodLimit),
        boostingThreshold: 0, // TODO:
        // confidence: Number(item.confidence),
        createdAt: Number(item.createdAt),
        dao: new DAO(item.dao.id, this.context),
        description: item.description,
        descriptionHash: item.descriptionHash,
        ethReward: new BN(item.ethReward),
        executedAt: item.executedAt,
        externalTokenReward: new BN(item.externalTokenReward),
        id: item.id,
        nativeTokenReward: new BN(item.nativeTokenReward),
        preBoostedVotePeriodLimit: Number(item.preBoostedVotePeriodLimit),
        proposer: item.proposer,
        proposingRepReward: new BN(item.proposingRepReward),
        quietEndingPeriodBeganAt: item.quietEndingPeriodBeganAt,
        reputationReward: new BN(item.reputationReward),
        resolvedAt: item.resolvedAt !== undefined ? Number(item.resolvedAt) : null,
        stage: proposalStage,
        stakesAgainst: new BN(item.stakesAgainst),
        stakesFor: new BN(item.stakesFor),
        title: item.title,
        totalRepWhenExecuted: Number(item.totalRepWhenExecuted),
        url: item.url,
        votesAgainst: new BN(item.votesAgainst),
        votesFor: new BN(item.votesFor),
        winningOutcome: item.winningOutcome
      }
    }

    this.state = context._getObservableObject(query, itemMap) as Observable<IProposalState>
  }

  /**
   * [votingMachine description]
   * @return [description]
   */
  public votingMachine() {
    return this.context.getContract('GenesisProtocol')
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    options.proposal = this.id
    return Vote.search(this.context, options)
  }

  /**
   * Vote for this proposal
   * @param  outcome one of ProposalOutcome.Pass (0) or ProposalOutcome.FAIL (1)
   * @param  amount the amount of reputation to vote with. Defaults to 0 - in that case,
   *  all the sender's rep will be used
   * @return  an observable Operation<Vote>
   */
  public vote(outcome: ProposalOutcome, amount: number = 0): Operation<Vote|null> {

    const votingMachine = this.votingMachine()

    const voteMethod = votingMachine.methods.vote(
      this.id,  // proposalId
      outcome, // a value between 0 to and the proposal number of choices.
      amount.toString(), // amount of reputation to vote with . if _amount == 0 it will use all voter reputation.
      nullAddress
    )

    return this.context.sendTransaction(
      voteMethod,
      (receipt: any) => {
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
      },
      async (error: Error) => { // errorHandler
        if (error.message.match(/revert/)) {
          const proposal = this
          const prop = await votingMachine.methods.proposals(proposal.id).call()
          if (prop.proposer === nullAddress ) {
            return new Error(`Unknown proposal with id ${proposal.id}`)
          }
        }
        // if we have found no known error, we return the original error
        return error
      }
    )
  }

  public stakingToken() {
    return new Token(this.context.getContract('GEN').options.address, this.context)
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    options.proposal = this.id
    return Stake.search(this.context, options)
  }

  public stake(outcome: ProposalOutcome, amount: BN ): Operation<Stake> {
    const stakeMethod = this.votingMachine().methods.stake(
      this.id,  // proposalId
      outcome, // a value between 0 to and the proposal number of choices.
      amount.toString() // the amount of tokens to stake
    )

    return this.context.sendTransaction(
      stakeMethod,
      (receipt: any) => { // map extracts Stake instance from receipt
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
      },
      async (error: Error) => { // errorHandler
        if (error.message.match(/revert/)) {
          const proposal = this
          const stakingToken = this.stakingToken()
          const prop = await this.votingMachine().methods.proposals(proposal.id).call()
          if (prop.proposer === nullAddress ) {
            return new Error(`Unknown proposal with id ${proposal.id}`)
          }

          // staker has sufficient balance
          const defaultAccount = await this.context.getAccount().pipe(first()).toPromise()
          const balance = new BN(await stakingToken.getContract().methods.balanceOf(defaultAccount).call())
          const amountBN = new BN(amount)
          if (balance.lt(amountBN)) {
            const msg = `Staker ${defaultAccount} has insufficient balance to stake ${amount.toString()}
              (balance is ${balance.toString()})`
            return new Error(msg)
          }

          // staker has approved the token spend
          const allowance = new BN(await stakingToken.getContract().methods.allowance(
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
    )
  }

  public rewards(options: IRewardQueryOptions = {}): Observable<IRewardState[]> {
    options.proposal = this.id
    return Reward.search(this.context, options)
  }

  public claimRewards(account: Address): Operation<boolean> {
    const transaction = this.votingMachine().methods.redeem(this.id, account)
    return this.context.sendTransaction(transaction, () => true)
  }

  public execute(): Operation<any> {
    const transaction = this.votingMachine().methods.execute(this.id)
    const map = (receipt: any) => {
      if (Object.keys(receipt.events).length  === 0) {
        // this does not mean that anything failed,
        return receipt
      } else {
        return receipt
      }
    }
    return this.context.sendTransaction(transaction, map)
  }
}

enum ProposalQuerySortOptions {
  resolvesAt = 'resolvesAt'
  // 'resolvesAt' should be ok for the current alchemy; will add more options as needed.
}

export interface IProposalQueryOptions extends ICommonQueryOptions {
  active?: boolean
  boosted?: boolean
  proposer?: Address
  proposalId?: string
  stage?: ProposalStage
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
  nativeTokenReward?: BN
  reputationReward?: BN
  ethReward?: BN
  externalTokenReward?: BN
  externalTokenAddress?: Address
  periodLength?: number
  periods?: any
  title?: string
  type?: string
  url?: string
}
