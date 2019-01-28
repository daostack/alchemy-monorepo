import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { DAO } from './dao'
import { Logger } from './logger'
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
  descriptionHash?: string
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
        const ipfsResponse = await context.ipfs.add(new Buffer(JSON.stringify(ipfsDataToSave)))
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

    return sendTransaction(createTransaction, map)
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
          proposer {
            id
            address
          }
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

      let proposalStage: ProposalStage
      switch (item.stage) {
        case 'Open':
          proposalStage = ProposalStage.Open
          break
        case 'Boosted':
          proposalStage = ProposalStage.Boosted
          break
        case 'QuietEndingPeriod':
          proposalStage = ProposalStage.QuietEndingPeriod
          break
        case 'Resolved':
          proposalStage = ProposalStage.Resolved
          break
        default:
          throw Error(`Unknown proposal stage: ${item.stage}`)
      }

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
        preBoostedVotePeriodLimit: Number(item.preBoostedVotePeriodLimit),
        proposer: item.proposer && item.proposer.address,
        proposingRepReward: Number(item.proposingRepReward),
        quietEndingPeriodBeganAt: item.quietEndingPeriodBeganAt,
        reputationReward: Number(item.reputationReward),
        resolvedAt: item.resolvedAt !== undefined ? Number(item.resolvedAt) : null,
        stage: proposalStage,
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

    this.state = context._getObservableObject(query, itemMap, { fetchPolicy: 'no-cache' }) as Observable<IProposalState>
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

  public stake(outcome: ProposalOutcome, amount: number): Operation<void> {
    throw new Error('not implemented')
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
