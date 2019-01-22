import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'

import { Arc } from './arc'
import { DAO } from './dao'
import { Operation, sendTransaction } from './operation'
import { IRewardQueryOptions, IRewardState, Reward } from './reward'
import { IStake, IStakeQueryOptions, Stake } from './stake'
import { Address, Date, ICommonQueryOptions, IStateful } from './types'
import { nullAddress } from './utils'
import { IVote, IVoteQueryOptions, Vote } from './vote'

export enum ProposalOutcome {
  None,
  Pass,
  Fail
}

export enum ProposalStage {
  Open,
  Boosted,
  QuietEndingPeriod,
  Resolved
}

export interface IProposalState {
  id: string
  beneficiary: Address
  boostedAt: Date
  boostingThreshold: number
  boostedVotePeriodLimit: number
  createdAt: Date
  dao: DAO
  description?: string
  ethReward: number
  executedAt: Date
  externalTokenReward: number
  ipfsHash: string
  preBoostedVotePeriodLimit: number
  proposer: Address
  proposingRepReward: number
  quietEndingPeriodBeganAt: Date
  reputationReward: number
  resolvedAt: Date
  stage: ProposalStage
  stakesFor: number
  stakesAgainst: number
  title?: string
  url?: string
  tokensReward: number
  votesFor: number
  votesAgainst: number
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
    const dao = new DAO(options.dao, context)
    const contributionReward = context.getContract('ContributionReward')

    const propose = contributionReward.methods.proposeContributionReward(
        options.dao,
        // TODO: after upgrading arc, use empty string as default value for ipfsHash
        options.ipfsHash || '0x0000000000000000000000000000000000000000000000000000000000000000',
        options.reputationReward || 0,
        [
          options.nativeTokenReward || 0,
          options.ethReward || 0,
          options.externalTokenReward || 0,
          // TODO: what are decent default values for periodLength and periods?
          options.periodLength || 0,
          options.periods || 0
        ],
        options.externalTokenAddress || nullAddress,
        options.beneficiary
    )

    return sendTransaction(propose, (receipt: any) => {
      const proposalId = receipt.events.NewContributionProposal.returnValues._proposalId
      return new Proposal(proposalId, dao.address, context)
    })
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
          dao {
            id
          }
          proposer {
            id
          }
          stage
          createdAt
          boostedAt
          quietEndingPeriodBeganAt
          executedAt
          ipfsHash
          title
          description
          url
          rewards {
            id
          }
          votes {
            id
          }
          votesFor
          votesAgainst
          winningOutcome
          stakes {
            id
          }
          stakesFor
          stakesAgainst
          queuedVoteRequiredPercentage
          queuedVotePeriodLimit
          boostedVotePeriodLimit
          preBoostedVotePeriodLimit
          thresholdConst
          limitExponentValue
          quietEndingPeriod
          proposingRepReward
          minimumStakingFee
          # votersReputationLossRatio FIXME
          minimumDaoBounty
          daoBountyConst
          activationTime
          voteOnBehalf
          beneficiary
          reputationReward
          tokensReward
          ethReward
          externalTokenReward
          externalToken
          periods
          periodLength
        }
      }
    `

    const itemMap = (item: any) => {
      if (item === null) {
        throw Error(`Could not find a Proposal with id '${id}'`)
      }

      return {
        beneficiary: item.beneficiary,
        boostedAt: Number(item.boostedAt),
        boostedVotePeriodLimit: Number(item.boostedVotePeriodLimit),
        boostingThreshold: 0, // TODO:
        createdAt: Number(item.createdAt),
        dao: new DAO(item.dao.id, this.context),
        description: item.description,
        ethReward: Number(item.ethReward),
        executedAt: item.executedAt,
        externalTokenReward: Number(item.externalTokenReward),
        id: item.id,
        ipfsHash: item.ipfsHash,
        preBoostedVotePeriodLimit: Number(item.preBoostedVotePeriodLimit),
        proposer: item.proposer && item.proposer.id,
        proposingRepReward: Number(item.proposingRepReward),
        quietEndingPeriodBeganAt: item.quietEndingPeriodBeganAt,
        reputationReward: Number(item.reputationReward),
        resolvedAt: item.resolvedAt !== undefined ? Number(item.resolvedAt) : null,
        stage: item.stage,
        stakesAgainst: Number(item.stakesAgainst),
        stakesFor: Number(item.stakesFor),
        title: item.title,
        tokensReward: Number(item.tokensReward),
        url: item.url,
        votesAgainst: item.votesFor,
        votesFor: item.votesAgainst,
        winningOutcome: item.winningOutcome
      }
    }

    this.state = context._getObservableObject(query, 'proposal', itemMap) as Observable<IProposalState>
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    options.proposal = this.id
    return Vote.search(this.context, options)
  }

  public vote(outcome: ProposalOutcome): Operation<Vote> {

    // TODO: cf next two lines from alchemy on how to get the votingMacchineAddress
    // (does not work with new contract versions anymore, though, it seems)
    // const contributionRewardInstance = this.dao.getContract('ContributionReward')
    // const result = await contributionRewardInstance.methods.parameters(this.dao.address).call()
    // const votingMachineAddress = (
    //   await contributionRewardInstance.methods.getSchemeParameters(daoAvatarAddress)).votingMachineAddress

    // the graph indexes it at contributionRewardProposal.votingMachine, but not on the proposal entity
    // const votingMachine = this.dao.getContract('AbsoluteVote')
    const votingMachine = this.context.getContract('GenesisProtocol')

    // TODO: implement error handling
    // One type of error is that the proposalId is not known:
    // const proposal = await votingMachine.methods.proposals(this.id).call()

    const voteMethod = votingMachine.methods.vote(
      this.id,  // proposalId
      outcome, // a value between 0 to and the proposal number of choices.
      0, // aamount the reputation amount to vote with . if _amount == 0 it will use all voter reputation.
      nullAddress
    )

    return sendTransaction(voteMethod, (receipt: any) => {
      const event = receipt.events.VoteProposal
      if (!event) {
        console.log(receipt)
        // for some reason, a transaction was mined but no error was raised before
        throw new Error(`Error voting: no VoteProposal event was found - ${Object.keys(receipt.events)}`)
      }
      // TODO: calculate the voteId. This uses some subgraph-internal logic
      // const voteId = eventId(event)
      const voteId = '0xdummy'

      return new Vote(
        voteId,
        event.returnValues._voter,
        // createdAt is "about now", but we cannot calculate the data that will be indexed by the subgraph
        0, // creatdeAt -
        outcome,
        event.returnValues._reputation, // amount
        this.id, // proposalID
        this.dao.address
      )
    })

  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    options.proposal = this.id
    return Stake.search(this.context, options)
  }

  public stake(outcome: ProposalOutcome, amount: number ): Operation<Stake> {
    // TODO: cf next two lines from alchemy on how to get the votingMacchineAddress
    // (does not work with new contract versions anymore, though, it seems)
    // const contributionRewardInstance = this.dao.getContract('ContributionReward')
    // const result = await contributionRewardInstance.methods.parameters(this.dao.address).call()
    // const votingMachineAddress = (
    //   await contributionRewardInstance.methods.getSchemeParameters(daoAvatarAddress)).votingMachineAddress

    // the graph indexes it at contributionRewardProposal.votingMachine, but not on the proposal entity
    // const votingMachine = this.dao.getContract('AbsoluteVote')
    const votingMachine = this.context.getContract('GenesisProtocol')

    // TODO: implement error handling
    // One type of error is that the proposalId is not known:
    // const proposal = await votingMachine.methods.proposals(this.id).call()

    const stakeMethod = votingMachine.methods.stake(
      this.id,  // proposalId
      outcome, // a value between 0 to and the proposal number of choices.
      amount // aamount the reputation amount to stake with . if _amount == 0 it will use all staker reputation.
      // nullAddress
    )

    return sendTransaction(
      stakeMethod,
      (receipt: any) => { // map extracts Stake instance from receipt
        const event = receipt.events.Stake
        if (!event) {
          console.log(receipt)
          // for some reason, a transaction was mined but no error was raised before
          throw new Error(`Error voting: no "Stake" event was found - ${Object.keys(receipt.events)}`)
        }
        // TODO: calculate the voteId. This uses some subgraph-internal logic
        // const voteId = eventId(event)
        const stakeId = '0xdummy'

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
          const stakingToken = this.context.getContract('DAOToken')
          const prop = await votingMachine.methods.proposals(proposal.id).call()
          if (prop.proposer === nullAddress ) {
            return new Error(`Unknown proposal with id ${proposal.id}`)
          }

          // staker has sufficient balance
          const defaultAccount = this.context.web3.eth.defaultAccount
          const balance = await stakingToken.methods.balanceOf(defaultAccount).call()
          if (Number(balance) < amount) {
            return new Error(`Staker has insufficient balance to stake ${amount} (balance is ${balance})`)
          }

          // staker has approved the token spend
          const allowance = await stakingToken.methods.allowance(defaultAccount, votingMachine.options.address).call()
          if (Number(allowance) < amount) {
            return new Error(`Staker has insufficient allowance to stake ${amount} (allowance is ${allowance})`)
          }
        }
        // if we have found no known error, we return the original error
        return error
      }
    )
  }

  public rewards(options: IRewardQueryOptions = {}): Observable < IRewardState[] > {
    options.proposal = this.id
    return Reward.search(this.context, options)
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
  ipfsHash?: string
  nativeTokenReward?: number
  reputationReward?: number
  ethReward?: number
  externalTokenReward?: number
  externalTokenAddress?: Address
  periodLength?: number
  periods?: any
  type?: string
  }
