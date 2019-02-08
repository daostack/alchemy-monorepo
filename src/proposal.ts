import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { DAO } from './dao'
import { Logger } from './logger'
import { Operation } from './operation'
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
  createdAt: Date
  dao: DAO
  description?: string
  ethReward: number
  executedAt: Date
  externalTokenReward: number
  descriptionHash?: string
  nativeTokenReward: number
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

    let ipfsDataToSave: object = {}
    if (options.title || options.url || options.description) {
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
          // TODO: after upgrading arc, use empty string as default value for descriptionHash
          options.descriptionHash || '0x0000000000000000000000000000000000000000000000000000000000000000',
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
          dao {
            id
          }
          proposer
          stage
          createdAt
          boostedAt
          quietEndingPeriodBeganAt
          executedAt
          descriptionHash
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
          votersReputationLossRatio
          minimumDaoBounty
          daoBountyConst
          activationTime
          voteOnBehalf
          beneficiary
          reputationReward
          nativeTokenReward
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
        return item
        // throw Error(`Could not find a Proposal with id '${id}'`)
      }

      const proposalStage = ProposalStage[item.stage]
      //
      // switch (item.stage) {
      //   case 'None':
      //     proposalStage = ProposalStage.None
      //     break
      //   case 'Boosted':
      //     proposalStage = ProposalStage.Boosted
      //     break
      //   case 'Queued':
      //     proposalStage = ProposalStage.Queued
      //     break
      //   case 'QuietEndingPeriod':
      //     proposalStage = ProposalStage.QuietEndingPeriod
      //     break
      //   case 'Resolved':
      //     proposalStage = ProposalStage.Resolved
      //     break
      //   default:
      //     throw Error(`Unknown proposal stage: ${item.stage}`)
      // }

      return {
        beneficiary: item.beneficiary,
        boostedAt: Number(item.boostedAt),
        boostedVotePeriodLimit: Number(item.boostedVotePeriodLimit),
        boostingThreshold: 0, // TODO:
        createdAt: Number(item.createdAt),
        dao: new DAO(item.dao.id, this.context),
        description: item.description,
        descriptionHash: item.descriptionHash,
        ethReward: Number(item.ethReward),
        executedAt: item.executedAt,
        externalTokenReward: Number(item.externalTokenReward),
        id: item.id,
        nativeTokenReward: Number(item.nativeTokenReward),
        preBoostedVotePeriodLimit: Number(item.preBoostedVotePeriodLimit),
        proposer: item.proposer,
        proposingRepReward: Number(item.proposingRepReward),
        quietEndingPeriodBeganAt: item.quietEndingPeriodBeganAt,
        reputationReward: Number(item.reputationReward),
        resolvedAt: item.resolvedAt !== undefined ? Number(item.resolvedAt) : null,
        stage: proposalStage,
        stakesAgainst: Number(item.stakesAgainst),
        stakesFor: Number(item.stakesFor),
        title: item.title,
        url: item.url,
        votesAgainst: Number(item.votesAgainst),
        votesFor: Number(item.votesFor),
        winningOutcome: item.winningOutcome
      }
    }

    // TODO: the 'no-cache' statement here is suspicious, check if it is really needed and why
    this.state = context._getObservableObject(query, itemMap, { fetchPolicy: 'no-cache' }) as Observable<IProposalState>
  }

  /**
   * [votingMachine description]
   * @return [description]
   */
  public votingMachine() {
    // TODO: get the contract not from migration.json but from the proposal itself!
    // TODO: cf next two lines from alchemy on how to get the votingMacchineAddress
    // (does not work with new contract versions anymore, though, it seems)
    // const contributionRewardInstance = this.dao.getContract('ContributionReward')
    // const result = await contributionRewardInstance.methods.parameters(this.dao.address).call()
    // const votingMachineAddress = (
    //   await contributionRewardInstance.methods.getSchemeParameters(daoAvatarAddress)).votingMachineAddress
    // the graph indexes it at contributionRewardProposal.votingMachine, but not on the proposal entity
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
  public vote(outcome: ProposalOutcome, amount: number = 0): Operation<Vote> {

    const votingMachine = this.votingMachine()

    const voteMethod = votingMachine.methods.vote(
      this.id,  // proposalId
      outcome, // a value between 0 to and the proposal number of choices.
      amount, // amount of reputation to vote with . if _amount == 0 it will use all voter reputation.
      nullAddress
    )

    return this.context.sendTransaction(
      voteMethod,
      (receipt: any) => {
        const event = receipt.events.VoteProposal
        if (!event) {
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

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    options.proposal = this.id
    return Stake.search(this.context, options)
  }

  public stake(outcome: ProposalOutcome, amount: number ): Operation<Stake> {
    const stakeMethod = this.votingMachine().methods.stake(
      this.id,  // proposalId
      outcome, // a value between 0 to and the proposal number of choices.
      amount // amount the amount to stake with . if _amount == 0 it will use all staker reputation.
      // nullAddress
    )

    return this.context.sendTransaction(
      stakeMethod,
      (receipt: any) => { // map extracts Stake instance from receipt
        const event = receipt.events.Stake
        if (!event) {
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
          const prop = await this.votingMachine().methods.proposals(proposal.id).call()
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
          const allowance = await stakingToken.methods.allowance(
            defaultAccount, this.votingMachine().options.address
          ).call()
          if (Number(allowance) < amount) {
            return new Error(`Staker has insufficient allowance to stake ${amount} (allowance is ${allowance})`)
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
  nativeTokenReward?: number
  reputationReward?: number
  ethReward?: number
  externalTokenReward?: number
  externalTokenAddress?: Address
  periodLength?: number
  periods?: any
  title?: string
  type?: string
  url?: string
  }
