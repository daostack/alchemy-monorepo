import BN = require('bn.js')
import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Logger } from '../src/logger'
import { IContributionReward, IProposalStage, IProposalType, Proposal } from '../src/proposal'
import {
  fromWei,
  getContractAddressesFromMigration,
  getTestDAO,
  newArc,
  toWei,
  waitUntilTrue
} from './utils'

Logger.setLevel(Logger.OFF)

describe('Create a ContributionReward proposal', () => {
  let arc: Arc
  let web3: any
  let accounts: any

  beforeAll(async () => {
    arc = await newArc()
    web3 = arc.web3
    accounts = web3.eth.accounts.wallet
    web3.eth.defaultAccount = accounts[0].address
  })

  it('is properly indexed', async () => {
    const dao = await getTestDAO()
    const options = {
      beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
      ethReward: toWei('300'),
      externalTokenAddress: undefined,
      externalTokenReward: toWei('0'),
      nativeTokenReward: toWei('1'),
      reputationReward: toWei('10'),
      type: IProposalType.ContributionReward
    }

    const response = await dao.createProposal(options).send()
    const proposal = response.result as Proposal
    let proposals: Proposal[] = []
    const proposalIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      proposals = await Proposal.search({id: proposal.id}, arc, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return proposals.length > 0
    }
    await waitUntilTrue(proposalIsIndexed)

    expect(proposal.id).toBeDefined()
    const proposalState = await proposal.state().pipe(first()).toPromise()

    const contributionReward = proposalState.contributionReward as IContributionReward
    expect(fromWei(contributionReward.externalTokenReward)).toEqual('0')
    expect(fromWei(contributionReward.ethReward)).toEqual('300')
    expect(fromWei(contributionReward.nativeTokenReward)).toEqual('1')
    expect(fromWei(contributionReward.reputationReward)).toEqual('10')
    expect(fromWei(proposalState.stakesAgainst)).toEqual('0.0000001') // TODO: why this amount?
    expect(fromWei(proposalState.stakesFor)).toEqual('0')

    expect(proposalState).toMatchObject({
      executedAt: 0,
      proposer: dao.context.web3.eth.defaultAccount.toLowerCase(),
      quietEndingPeriod: 300,
      quietEndingPeriodBeganAt: 0,
      resolvedAt: 0,
      stage: IProposalStage.Queued
    })

    expect(proposalState.contributionReward).toMatchObject({
      beneficiary: options.beneficiary
    })

    expect(proposalState.dao).toMatchObject({
      address: dao.address
    })
  })

  it('saves title etc on ipfs', async () => {
    const dao = await getTestDAO()
    const options = {
      beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
      description: 'Just eat them',
      ethReward: toWei('300'),
      externalTokenAddress: undefined,
      externalTokenReward: toWei('0'),
      nativeTokenReward: toWei('1'),
      title: 'A modest proposal',
      type: IProposalType.ContributionReward,
      url: 'http://swift.org/modest'
    }

    const response = await dao.createProposal(options).send()
    const proposal = response.result as Proposal
    let proposals: Proposal[] = []
    const proposalIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      proposals = await Proposal.search({id: proposal.id}, arc, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return proposals.length > 0
    }
    await waitUntilTrue(proposalIsIndexed)
    const proposal2 = new Proposal(proposal.id, proposal.dao.address, arc)
    const proposalState = await proposal2.state().pipe(first()).toPromise()
    expect(proposalState.descriptionHash).toEqual('QmRg47CGnf8KgqTZheTejowoxt4SvfZFqi7KGzr2g163uL')

    // get the data
    // TODO - do the round trip test to see if subgraph properly indexs the fields
    // (depends on https://github.com/daostack/subgraph/issues/42)
    const savedData = await arc.ipfs.cat(proposalState.descriptionHash) // + proposalState.descriptionHash)
    expect(JSON.parse(savedData.toString())).toEqual({
      description: options.description,
      title: options.title,
      url: options.url
    })

  })

  it('handles the fact that the ipfs url is not set elegantly', async () => {
    const arcWithoutIPFS = await newArc()
    arcWithoutIPFS.ipfsProvider = ''
    const contractAddresses = await getContractAddressesFromMigration()
    const dao = arcWithoutIPFS.dao(contractAddresses.dao.Avatar)
    const options = {
      beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
      description: 'Just eat them',
      ethReward: toWei('300'),
      externalTokenAddress: undefined,
      nativeTokenReward: toWei('1'),
      title: 'A modest proposal',
      type: IProposalType.ContributionReward,
      url: 'http://swift.org/modest'
    }

    expect(dao.createProposal(options).send()).rejects.toThrowError(
      /no ipfsProvider set/i
    )
  })
})
