import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { concatMap, first, map } from 'rxjs/operators'
import { Arc } from '../arc'
import { DAO } from '../dao'
import { mapGenesisProtocolParams } from '../genesisProtocol'
import { IApolloQueryOptions } from '../graphnode'
import { Operation, toIOperationObservable } from '../operation'
import { IProposalBaseCreateOptions, IProposalQueryOptions, IProposalState, Proposal } from '../proposal'
import { Address, ICommonQueryOptions, IStateful } from '../types'
import {
  concat,
  createGraphQlQuery, dateToSecondsSinceEpoch, getBlockTime,
  hexStringToUint8Array,
  NULL_ADDRESS,
  secondSinceEpochToDate
} from '../utils'
import { IVoteQueryOptions } from '../vote'
import { ISchemeState, SchemeBase } from './base'

const Web3 = require('web3')

export interface ICompetitionProposalState {
  id: string
  admin: Address
  contract: Address
  endTime: Date
  numberOfWinners: number
  rewardSplit: number[]
  startTime: Date
  votingStartTime: Date
  suggestionsEndTime: Date
  numberOfVotesPerVoter: number
  snapshotBlock: number
  createdAt: Date
  totalVotes: number
  totalSuggestions: number
  numberOfWinningSuggestions: number
}

export interface IProposalCreateOptionsCompetition extends IProposalBaseCreateOptions {
  // beneficiary: Address
  endTime: Date,
  reputationReward?: BN
  ethReward?: BN
  externalTokenReward?: BN
  externalTokenAddress?: Address
  // proposer: Address,
  rewardSplit: number[]
  nativeTokenReward?: BN
  numberOfVotesPerVoter: number
  proposerIsAdmin?: boolean, // true if new suggestions are limited to the proposer
  startTime: Date | null
  suggestionsEndTime: Date
  votingStartTime: Date
}

export interface ICompetitionSuggestionState {
  id: string
  suggestionId: number
  proposal: string
  descriptionHash: string
  title?: string
  description?: string
  url?: string
  // fulltext: [string]
  suggester: Address
  beneficiary: Address
  // votes: [CompetitionVote!] @derivedFrom(field: "suggestion")
  tags: string[]
  totalVotes: BN
  createdAt: Date
  redeemedAt: Date | null
  rewardPercentage: number
  positionInWinnerList: number | null // 0 is the first, null means it is not winning
  isWinner: boolean
}

export interface ICompetitionVoteState {
  id?: string
  proposal: string
  suggestion: string
  voter: Address
  createdAt?: Date
  reputation: BN
}

export class CompetitionScheme extends SchemeBase {
  public state(apolloQueryOptions: IApolloQueryOptions = {}): Observable<ISchemeState> {
    const query = gql`query SchemeStateById
      {
        controllerScheme (id: "${this.id}") {
          ...SchemeFields
        }
      }
      ${SchemeBase.fragments.SchemeFields}
    `

    const itemMap = (item: any): ISchemeState | null => {
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
      const uGenericSchemeParams = item.uGenericSchemeParams && {
        contractToCall: item.uGenericSchemeParams.contractToCall,
        voteParams: mapGenesisProtocolParams(item.uGenericSchemeParams.voteParams),
        votingMachine: item.uGenericSchemeParams.votingMachine
      }
      const contributionRewardParams = item.contributionRewardParams && {
        voteParams: mapGenesisProtocolParams(item.contributionRewardParams.voteParams),
        votingMachine: item.contributionRewardParams.votingMachine
      }
      const contributionRewardExtParams = item.contributionRewardExtParams && {
        rewarder: item.contributionRewardExtParams.rewarder,
        voteParams: mapGenesisProtocolParams(item.contributionRewardExtParams.voteParams),
        votingMachine: item.contributionRewardExtParams.votingMachine
      }
      const schemeRegistrarParams = item.schemeRegistrarParams && {
        voteRegisterParams: mapGenesisProtocolParams(item.schemeRegistrarParams.voteRegisterParams),
        voteRemoveParams: mapGenesisProtocolParams(item.schemeRegistrarParams.voteRemoveParams),
        votingMachine: item.schemeRegistrarParams.votingMachine
      }
      const genericSchemeParams = item.genericSchemeParams && {
        contractToCall: item.genericSchemeParams.contractToCall,
        voteParams: mapGenesisProtocolParams(item.genericSchemeParams.voteParams),
        votingMachine: item.genericSchemeParams.votingMachine
      }
      const schemeParams = (
        uGenericSchemeParams || contributionRewardParams ||
        schemeRegistrarParams || genericSchemeParams || contributionRewardExtParams
      )
      return {
        address: item.address,
        canDelegateCall: item.canDelegateCall,
        canManageGlobalConstraints: item.canManageGlobalConstraints,
        canRegisterSchemes: item.canRegisterSchemes,
        canUpgradeController: item.canUpgradeController,
        contributionRewardExtParams,
        contributionRewardParams,
        dao: item.dao.id,
        genericSchemeParams,
        id: item.id,
        isRegistered: item.isRegistered,
        name,
        numberOfBoostedProposals: Number(item.numberOfBoostedProposals),
        numberOfPreBoostedProposals: Number(item.numberOfPreBoostedProposals),
        numberOfQueuedProposals: Number(item.numberOfQueuedProposals),
        paramsHash: item.paramsHash,
        schemeParams,
        schemeRegistrarParams,
        uGenericSchemeParams,
        version: item.version
      }
    }
    return this.context.getObservableObject(query, itemMap, apolloQueryOptions) as Observable<ISchemeState>
  }
  /**
   * Return a list of competitions in this scheme.
   * @param options
   * @param apolloQueryOptions
   */
  public competitions(
    options: IProposalQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Competition[]> {
    // TODO: This function will error if the current scheme is not a competiion scheme
    // const staticState = await this.fetchStaticState()
    // if (staticState.name !== `ContributionRewardExt`) {
    //   // TODO: we should also check if the calling
    //   throw Error(`This scheme is not a competition scheme - so no competitions can be found`)
    // }
    if (!options.where) { options.where = {} }
    options.where = { ...options.where, competition_not: null }
    return Competition.search(this.context, options, apolloQueryOptions)
  }

  /**
   *
   * @param options
   * @param context
   */
  public createProposalTransaction(options: IProposalCreateOptionsCompetition) {
    // we assume this function is called with the correct scheme options..
    return async () => {
      const context = this.context
      const schemeState = await this.state().pipe(first()).toPromise()
      if (!schemeState) {
        throw Error(`No scheme was found with this id: ${this.id}`)
      }
      const contract = getCompetitionContract(schemeState, this.context)

      // check sanity -- is the competition contract actually c
      const contributionRewardExtAddress = await contract.methods.contributionRewardExt().call()
      if (contributionRewardExtAddress.toLowerCase() !== schemeState.address) {
        throw Error(`This ContributionRewardExt/Competition combo is malconfigured: expected ${contributionRewardExtAddress.toLowerCase()} to equal ${schemeState.address}`)
      }

      options.descriptionHash = await context.saveIPFSData(options)
      if (!options.rewardSplit) {
        throw Error(`Rewardsplit was not given..`)
      } else {
        if (options.rewardSplit.reduce((a: number, b: number) => a + b) !== 100) {
          throw Error(`Rewardsplit must sum 100 (they sum to  ${options.rewardSplit.reduce((a: number, b: number) => a + b)})`)
        }
      }
      // * @param _rewardSplit an array of precentages which specify how to split the rewards
      // *         between the winning suggestions
      // * @param _competitionParams competition parameters :
      // *         _competitionParams[0] - competition startTime
      // *         _competitionParams[1] - _votingStartTime competition voting start time
      // *         _competitionParams[2] - _endTime competition end time
      // *         _competitionParams[3] - _maxNumberOfVotesPerVoter on how many suggestions a voter can vote
      // *         _competitionParams[4] - _suggestionsEndTime suggestion submition end time
      // *         _competitionParams[4] - _suggestionsEndTime suggestion submition end time

      const competitionParams = [
        options.startTime && dateToSecondsSinceEpoch(options.startTime) || 0,
        dateToSecondsSinceEpoch(options.votingStartTime) || 0,
        dateToSecondsSinceEpoch(options.endTime) || 0,
        options.numberOfVotesPerVoter.toString() || 0,
        dateToSecondsSinceEpoch(options.suggestionsEndTime) || 0
      ]
      const proposerIsAdmin = !!options.proposerIsAdmin

      const transaction = contract.methods.proposeCompetition(
        options.descriptionHash || '',
        options.reputationReward && options.reputationReward.toString() || 0,
        [
          options.nativeTokenReward && options.nativeTokenReward.toString() || 0,
          options.ethReward && options.ethReward.toString() || 0,
          options.externalTokenReward && options.externalTokenReward.toString() || 0
        ],
        options.externalTokenAddress || NULL_ADDRESS,
        options.rewardSplit,
        competitionParams,
        proposerIsAdmin
      )
      return transaction
    }
  }
  public createProposalTransactionMap() {
    const eventName = 'NewCompetitionProposal'
    const txMap = (receipt: any) => {
      const proposalId = receipt.events[eventName].returnValues._proposalId
      return new Proposal(proposalId, this.context)
    }
    return txMap
  }

  public createProposalErrorHandler(options: any): (err: Error) => Error | Promise<Error> {
    return async (err) => {
      const tx = await this.createProposalTransaction(options)()
      try {
        await tx.call()
      } catch (err) {
        if (err.message.match(/startTime should be greater than proposing time/ig)) {
          return Error(`${err.message} - startTime is ${options.startTime}, current block time is ${await getBlockTime(this.context.web3)}`)
        } else {
          return err
        }
      }
      const msg = `Error creating proposal: ${err.message}`
      return Error(msg)
    }
  }

  /**
   * create a proposal for starting a Competition
   *
   * @param {IProposalCreateOptionsCompetition} options
   * @returns {Operation<Proposal>}
   * @memberof CompetitionScheme
   */
  public createProposal(options: IProposalCreateOptionsCompetition): Operation<Proposal> {
    return SchemeBase.prototype.createProposal.call(this, options)
  }

  public async getCompetitionContract() {
    const schemeState = await this.state().pipe(first()).toPromise()
    const contract = getCompetitionContract(schemeState, this.context)
    return contract
  }

  /**
   * Vote for the suggestion that is, in the current scheme, identified by  suggestionId
   *
   * @param {{
   *     suggestionId: number // this is the suggestion COUNTER
   *   }} options
   * @returns {Operation<CompetitionVote>}
   * @memberof CompetitionScheme
   */
  public voteSuggestion(options: {
    suggestionId: number // this is the suggestion COUNTER
  }): Operation<CompetitionVote> {
    const createTransaction = async () => {
      const contract = await this.getCompetitionContract()
      const transaction = contract.methods.vote(options.suggestionId)
      return transaction
    }

    const mapReceipt = (receipt: any) => {
      if (Object.keys(receipt.events).length === 0) {
        // this does not mean that anything failed
        return receipt
      } else {
        const eventName = 'NewVote'
        // emit NewVote(proposalId, _suggestionId, msg.sender, reputation);
        const suggestionId = receipt.events[eventName].returnValues._suggestionId
        const voter = receipt.events[eventName].returnValues._voter
        const reputation = receipt.events[eventName].returnValues._reputation
        const proposal = receipt.events[eventName].returnValues._proposalId
        const suggestion = CompetitionSuggestion.calculateId({
          scheme: this.id,
          suggestionId
        })
        return new CompetitionVote({
          proposal,
          reputation,
          suggestion,
          voter
        }, this.context)
      }
    }
    const errorHandler = async (err: Error) => {
      const schemeState = await this.state().pipe(first()).toPromise()
      const contract = getCompetitionContract(schemeState, this.context)
      // see if the suggestionId does exist in the contract
      const suggestion = await contract.methods.suggestions(options.suggestionId).call()
      if (suggestion.proposalId === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        throw Error(`A suggestion with suggestionId ${options.suggestionId} does not exist`)
      }

      // check if the sender has reputation in the DAO
      const state = await this.state().pipe(first()).toPromise()
      const dao = new DAO(state.dao, this.context)
      const reputation = await dao.nativeReputation().pipe(first()).toPromise()
      const sender = await this.context.getAccount().pipe(first()).toPromise()
      const reputationOfUser = await reputation.reputationOf(sender).pipe(first()).toPromise()
      if (reputationOfUser.isZero()) {
        throw Error(`Cannot vote because the user ${sender} does not have any reputation in the DAO at ${dao.id}`)
      }
      // get any solidity-defined errors
      const tx = await createTransaction()
      await tx.call()
      return err
    }
    const observable = this.context.sendTransaction(createTransaction, mapReceipt, errorHandler)
    return toIOperationObservable(observable)
  }

  public redeemSuggestion(options: {
    suggestionId: number // this is the suggestion COUNTER
  }): Operation<boolean> {
    const createTransaction = async () => {
      const schemeState = await this.state().pipe(first()).toPromise()
      const contract = getCompetitionContract(schemeState, this.context)
      const transaction = contract.methods.redeem(options.suggestionId)
      return transaction
    }

    const mapReceipt = (receipt: any) => {
      if (Object.keys(receipt.events).length === 0) {
        return receipt
      } else {
        // const eventName = 'Redeem'
        // const proposalId = receipt.events[eventName].returnValues._proposalId
        // const suggestionId = receipt.events[eventName].returnValues._suggestionId
        // const rewardPercentage = receipt.events[eventName].returnValues._rewardPercentage
        return true
      }
    }
    const errorHandler = async (err: Error) => {
      const schemeState = await this.state().pipe(first()).toPromise()
      const contract = getCompetitionContract(schemeState, this.context)
      // see if the suggestionId does exist in the contract
      const suggestion = await contract.methods.suggestions(options.suggestionId).call()
      if (suggestion.proposalId === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        throw Error(`A suggestion with suggestionId ${options.suggestionId} does not exist`)
      }
      const tx = await createTransaction()
      try {
        // call the transaction to get the solidity-defined errors
        await tx.call()
      } catch (err) {
        throw err
      }
      // const proposal = await contract.methods.proposals(suggestion.proposalId).call()
      // const proposalEndTime = new Date(proposal.endTime * 1000)
      // const currentTime = await getBlockTime(this.context.web3)
      // const msg = `Redeem failed because the proposals endTime ${proposalEndTime}
      //   is later then current block time ${currentTime}`
      // if (proposalEndTime > currentTime) {
      //   throw Error(msg)
      // }
      return err
    }
    const observable = this.context.sendTransaction(createTransaction, mapReceipt, errorHandler)
    return toIOperationObservable(observable)
  }

}

// export function createProposalErrorHandler(err: Error) {
//   return err
// }

export class Competition { // extends Proposal {
  public static search(
    context: Arc,
    options: IProposalQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Competition[]> {
    return Proposal.search(context, options, apolloQueryOptions).pipe(
      map((proposals: Proposal[]) => proposals.map((p: Proposal) => new Competition(p.id, context)))
    )
  }

  public id: string
  public context: Arc

  constructor(id: string, context: Arc) {
    // super(id, context)
    this.id = id
    this.context = context
  }

  public createSuggestion(options: {
    title: string,
    description: string,
    beneficiary?: Address,
    tags?: string[],
    url?: string

  }): Operation<any> {
    let schemeState: ISchemeState
    const createTransaction = async () => {
      const proposalState = await (new Proposal(this.id, this.context)).state().pipe(first()).toPromise()
      if (!options.beneficiary) {
        options.beneficiary = await this.context.getAccount().pipe(first()).toPromise()
      }
      schemeState = await (new CompetitionScheme(proposalState.scheme.id, this.context))
        .state().pipe(first()).toPromise()
      const contract = getCompetitionContract(schemeState, this.context)
      const descriptionHash = await this.context.saveIPFSData(options)
      const transaction = contract.methods.suggest(this.id, descriptionHash, options.beneficiary)
      return transaction
    }

    const mapReceipt = (receipt: any) => {
      if (Object.keys(receipt.events).length === 0) {
        // this does not mean that anything failed
        return receipt
      } else {
        const eventName = 'NewSuggestion'
        const suggestionId = receipt.events[eventName].returnValues._suggestionId
        return new CompetitionSuggestion({ scheme: (schemeState as ISchemeState).id, suggestionId }, this.context)
      }
    }
    const errorHandler = async (err: Error, transaction: any, opts?: any) => {
      // we got an error
      const contract = getCompetitionContract(schemeState, this.context)
      const proposal = await contract.methods.proposals(this.id).call(opts)
      if (!proposal) {
        throw Error(`A proposal with id ${this.id} does not exist`)
      }
      const tx = await createTransaction()
      await tx.call(opts)
      throw err
    }
    const observable = this.context.sendTransaction(createTransaction, mapReceipt, errorHandler)
    return toIOperationObservable(observable)
  }

  public voteSuggestion(suggestionId: number): Operation<CompetitionVote> {
    const proposal = new Proposal(this.id, this.context)
    const observable = proposal.state().pipe(
      first(),
      concatMap((competitionState: IProposalState) => {
        if (competitionState === null) {
          throw Error(`Cannot vote on this suggestion, because the competition with id ${this.id} could not be foound`)
        }
        const scheme = new CompetitionScheme(competitionState.scheme, this.context)
        return scheme.voteSuggestion({ suggestionId })
      })
    )
    return toIOperationObservable(observable)
  }
  public redeemSuggestion(suggestionId: number): Operation<boolean> {
    const proposal = new Proposal(this.id, this.context)
    const observable = proposal.state().pipe(
      first(),
      concatMap((competitionState: IProposalState) => {
        const scheme = new CompetitionScheme(competitionState.scheme, this.context)
        return scheme.redeemSuggestion({ suggestionId })
      })
    )
    return toIOperationObservable(observable)
  }

  public suggestions(
    options: ICompetitionSuggestionQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<CompetitionSuggestion[]> {
    if (!options.where) { options.where = {} }
    options.where.proposal = this.id
    return CompetitionSuggestion.search(this.context, options, apolloQueryOptions)
  }

  public votes(
    options: IVoteQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<CompetitionVote[]> {
    if (!options.where) { options.where = {} }
    options.where.proposal = this.id
    return CompetitionVote.search(this.context, options, apolloQueryOptions)
  }

}

export interface ICompetitionSuggestionQueryOptions extends ICommonQueryOptions {
  where?: {
    id?: string, // id of the competition
    proposal?: string, // id of the proposal
    suggestionId?: number // the "suggestionId" is a counter that is unique to the scheme
    // - and is not to be confused with suggestion.id
    positionInWinnerList?: number | null
    positionInWinnerList_not?: number | null
  }
}
export class CompetitionSuggestion implements IStateful<ICompetitionSuggestionState> {

  public static fragments = {
    CompetitionSuggestionFields: gql`fragment CompetitionSuggestionFields on CompetitionSuggestion {
      id
      suggestionId
      proposal {
       id
      }
      descriptionHash
      title
      description
      url
      tags {
        id
      }
      # fulltext: [string]
      beneficiary
      suggester
      # votes: [CompetitionVote!] @derivedFrom(field: "suggestion")
      totalVotes
      createdAt
      redeemedAt
      rewardPercentage
      positionInWinnerList
    }`
  }

  public static calculateId(opts: { scheme: Address, suggestionId: number }): string {
    const seed = concat(
      hexStringToUint8Array(opts.scheme.toLowerCase()),
      hexStringToUint8Array(Number(opts.suggestionId).toString(16))
    )
    return Web3.utils.keccak256(seed)
  }

  public static search(
    context: Arc,
    options: ICompetitionSuggestionQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<CompetitionSuggestion[]> {

    let query
    const itemMap = (item: any) => {
      return new CompetitionSuggestion(this.mapItemToObject(item, context) as ICompetitionSuggestionState, context)
    }

    // if we are looing for the suggestions of a particular proposal, we prime the cache..
    if (options.where && options.where.proposal && !options.where.id) {
      query = gql`query CompetitionSuggestionSearchByProposal
        {
          competitionProposal (id: "${options.where.proposal}") {
              suggestions ${createGraphQlQuery({ where: { ...options.where, proposal: undefined } })} {
                ...CompetitionSuggestionFields
              }
            }
        }
        ${CompetitionSuggestion.fragments.CompetitionSuggestionFields}
      `
      return context.getObservableObject(
        query,
        (r: any) => {
          if (r === null) { // no such proposal was found
            return []
          }
          return r.suggestions.map(itemMap)
        },
        apolloQueryOptions
      ) as Observable<CompetitionSuggestion[]>
    } else {
      query = gql`query CompetitionSuggestionSearch
        {
          competitionSuggestions ${createGraphQlQuery(options)} {
            ...CompetitionSuggestionFields
          }
        }
        ${CompetitionSuggestion.fragments.CompetitionSuggestionFields}
      `

      return context.getObservableList(
        query,
        itemMap,
        apolloQueryOptions
      ) as Observable<CompetitionSuggestion[]>
    }
  }

  private static mapItemToObject(item: any, context: Arc): ICompetitionSuggestionState | null {
    if (item === null) {
      return null
    }

    let redeemedAt = null
    if (item.redeemedAt !== null) {
      redeemedAt = secondSinceEpochToDate(item.redeemedAt)
    }
    let positionInWinnerList = null
    if (item.positionInWinnerList !== null) {
      positionInWinnerList = Number(item.positionInWinnerList)
    }
    return {
      beneficiary: item.beneficiary,
      createdAt: secondSinceEpochToDate(item.createdAt),
      description: item.description,
      descriptionHash: item.descriptionHash,
      id: item.id,
      isWinner: positionInWinnerList !== null,
      positionInWinnerList,
      proposal: item.proposal.id,
      redeemedAt,
      rewardPercentage: Number(item.rewardPercentage),
      suggester: item.suggester,
      suggestionId: item.suggestionId,
      tags: item.tags.map((tag: any) => tag.id),
      title: item.title,
      totalVotes: new BN(item.totalVotes),
      url: item.url
    }

  }

  public id: string
  public suggestionId?: number
  public staticState?: ICompetitionSuggestionState

  constructor(
    idOrOpts: string | { suggestionId: number, scheme: string } | ICompetitionSuggestionState,
    public context: Arc
  ) {
    if (typeof idOrOpts === 'string') {
      this.id = idOrOpts
    } else {
      if (
        Object.keys(idOrOpts).includes('scheme') &&
        Object.keys(idOrOpts).includes('suggestionId')
      ) {
        this.id = CompetitionSuggestion.calculateId(idOrOpts as { suggestionId: number, scheme: string })
        this.suggestionId = idOrOpts.suggestionId
      } else {
        const opts = idOrOpts as ICompetitionSuggestionState
        this.id = opts.id
        this.setStaticState(opts)
      }
    }
  }

  public setStaticState(opts: ICompetitionSuggestionState) {
    this.staticState = opts
  }

  public async fetchStaticState(): Promise<ICompetitionSuggestionState> {
    return this.state({ fetchPolicy: 'cache-first' }).pipe(first()).toPromise()
  }

  public state(apolloQueryOptions: IApolloQueryOptions = {}): Observable<ICompetitionSuggestionState> {
    const query = gql`query CompetitionSuggestionById
      {
        competitionSuggestion (id: "${this.id}") {
          ...CompetitionSuggestionFields
        }
      }
      ${CompetitionSuggestion.fragments.CompetitionSuggestionFields}
    `

    const itemMap = (item: any) => CompetitionSuggestion.mapItemToObject(item, this.context)
    return this.context.getObservableObject(query, itemMap, apolloQueryOptions)
  }

  public vote(): Operation<CompetitionVote> {
    const observable = this.state().pipe(
      first(),
      concatMap((suggestionState: ICompetitionSuggestionState) => {
        const competition = new Competition(suggestionState.proposal, this.context)
        return competition.voteSuggestion(suggestionState.suggestionId)
      })
    )
    return toIOperationObservable(observable)
  }

  public votes(
    options: ICompetitionVoteQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<CompetitionVote[]> {
    if (!options.where) { options.where = {} }
    options.where = { ...options.where, suggestion: this.id }
    return CompetitionVote.search(this.context, options, apolloQueryOptions)
  }

  public async getPosition() {
    console.warn(`This method is deprecated - please use the positionInWinnerList from the proposal state`)
    const suggestionState = await this.state().pipe(first()).toPromise()
    return suggestionState.positionInWinnerList
  }

  public async isWinner() {
    console.warn(`This method is deprecated - please use the positionInWinnerList !== from the proposal state`)
    const suggestionState = await this.state().pipe(first()).toPromise()
    return suggestionState.isWinner
  }

  public redeem(): Operation<boolean> {
    const observable = this.state().pipe(
      first(),
      concatMap((suggestionState: ICompetitionSuggestionState) => {
        const competition = new Competition(suggestionState.proposal, this.context)
        return competition.redeemSuggestion(suggestionState.suggestionId)
      })
    )
    return toIOperationObservable(observable)
  }
}
export interface ICompetitionVoteQueryOptions extends ICommonQueryOptions {
  where?: {
    id?: string
    suggestion?: string
    voter?: Address
    proposal?: string
    proposal_not?: string | null
  }
}

export class CompetitionVote implements IStateful<ICompetitionVoteState> {

  public static fragments = {
    CompetitionVoteFields: gql`fragment CompetitionVoteFields on CompetitionVote {
      id
      createdAt
      reputation
      voter
      proposal { id }
      suggestion { id }
    }`
  }

  public static search(
    context: Arc,
    options: ICompetitionVoteQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<CompetitionVote[]> {
    if (!options.where) { options.where = {} }

    const itemMap = (item: any) => {
      return new CompetitionVote(CompetitionVote.itemMap(item), context)
    }
    let query
    if (options.where.suggestion && !options.where.id) {
      query = gql`query CompetitionVoteSearchBySuggestion
        {
          competitionSuggestion (id: "${options.where.suggestion}") {
            id
            votes ${createGraphQlQuery({ where: { ...options.where, suggestion: undefined } })} {
              ...CompetitionVoteFields
            }
          }
        }
        ${CompetitionVote.fragments.CompetitionVoteFields}
      `

      return context.getObservableObject(
        query,
        (r: any) => {
          if (r === null) { // no such proposal was found
            return []
          }
          return r.votes.map(itemMap)
        },
        apolloQueryOptions
      ) as Observable<CompetitionVote[]>
    } else {

      query = gql`query CompetitionVoteSearch
        {
          competitionVotes ${createGraphQlQuery(options)} {
            ...CompetitionVoteFields
          }
        }
        ${CompetitionVote.fragments.CompetitionVoteFields}
      `

      return context.getObservableList(
        query,
        itemMap,
        apolloQueryOptions
      ) as Observable<CompetitionVote[]>
    }
  }
  public static itemMap(item: any) {

    return {
      createdAt: secondSinceEpochToDate(item.createdAt),
      id: item.id,
      proposal: item.proposal.id,
      reputation: item.reputation,
      suggestion: item.suggestion.id,
      voter: item.voter
    }
  }

  public id?: string
  public staticState?: ICompetitionVoteState

  constructor(idOrOpts: string | ICompetitionVoteState, public context: Arc) {
    if (typeof idOrOpts === 'string') {
      this.id = idOrOpts
    } else {
      const opts = idOrOpts as ICompetitionVoteState
      // this.id = opts.id
      this.setStaticState(opts)
    }
  }

  public setStaticState(opts: ICompetitionVoteState) {
    this.id = opts.id
    this.staticState = opts
  }
  public state(apolloQueryOptions: IApolloQueryOptions = {}): Observable<ICompetitionVoteState> {
    const query = gql`query CompetitionVoteById
      {
        competitionVote (id: "${this.id}") {
          ...CompetitionVoteFields
        }
      }
      ${CompetitionVote.fragments.CompetitionVoteFields}
      `
    return this.context.getObservableObject(query, CompetitionVote.itemMap, apolloQueryOptions)
  }

}

/**
 * If this scheme is a ContributionREwardExt scheme and if
 * its rewarder is Competition contract, return that contract
 * @param schemeState
 * @returns A Web3 contract instance
 */
export function getCompetitionContract(schemeState: ISchemeState, arc: Arc) {
  if (schemeState === null) {
    throw Error(`No scheme was provided`)
  }
  const rewarder = schemeState.contributionRewardExtParams && schemeState.contributionRewardExtParams.rewarder
  if (!rewarder) {
    throw Error(`This scheme's rewarder is not set, and so no compeittion contract could be found`)
  }

  if (!isCompetitionScheme(arc, schemeState)) {
    throw Error(`We did not find a Competition contract at the rewarder address ${rewarder}`)
  }
  const contract = arc.getContract(rewarder as Address)
  return contract
}

export function isCompetitionScheme(arc: Arc, item: any) {
  if (item.contributionRewardExtParams) {
    const contractInfo = arc.getContractInfo(item.contributionRewardExtParams.rewarder)
    const versionNumber = Number(contractInfo.version.split('rc.')[1])
    if (versionNumber < 39) {
      throw Error(`Competition contracts of version < 0.0.1-rc.39 are not supported`)
    }
    return contractInfo.name === 'Competition'
  } else {
    return false
  }
}

/**
 * @returns true if this is a ContributionRewardExt scheme and the rewarder of this scheme is a competition contract
 */
export function hasCompetitionContract(schemeState: ISchemeState, arc: Arc) {
  let contract
  try {
    contract = getCompetitionContract(schemeState, arc)
  } catch (err) {
    // pass
  }
  return !!contract
}
