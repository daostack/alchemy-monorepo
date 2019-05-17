import BN = require('bn.js')
import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { IProposalOutcome, Proposal } from '../src/proposal'
import { Stake } from '../src/stake'
import { createAProposal, getTestDAO, newArc, toWei, waitUntilTrue } from './utils'
const DAOstackMigration = require('@daostack/migration')

jest.setTimeout(10000)

describe('Stake on a ContributionReward', () => {
  let arc: Arc
  let web3: any
  let accounts: any

  beforeAll(async () => {
    arc = await newArc()
    web3 = arc.web3
    accounts = web3.eth.accounts.wallet
  })

  it('works and gets indexed', async () => {
    const dao = await getTestDAO()

    const proposal = await createAProposal(dao)
    const stakingToken =  await proposal.stakingToken()

    // approve the spend, for staking
    await stakingToken.approveForStaking(toWei('100')).send()

    const stake = await proposal.stake(IProposalOutcome.Pass, new BN(100)).send()

    expect(stake.result).toMatchObject({
      outcome : IProposalOutcome.Pass
    })

    let stakes: Stake[] = []

    const stakeIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      stakes = await Stake.search({proposal: proposal.id}, arc, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return stakes.length > 0
    }
    await waitUntilTrue(stakeIsIndexed)

    expect(stakes.length).toEqual(1)
  })

  it('throws a meaningful error if an insufficient amount tokens is approved for staking', async () => {
    const dao = await getTestDAO()
    const stakingToken =  arc.getContract('GEN')
    const proposal = await createAProposal(dao)
    await stakingToken.methods
      .mint(accounts[2].address, toWei('100').toString())
      .send({ gas: 1000000, from: accounts[0].address})
    proposal.context.web3.eth.defaultAccount = accounts[2].address
    await expect(proposal.stake(IProposalOutcome.Pass, toWei('100')).send()).rejects.toThrow(
      /insufficient allowance/i
    )
  })

  it('throws a meaningful error if then senders balance is too low', async () => {
    const dao = await getTestDAO()
    const proposal = await createAProposal(dao)
    proposal.context.web3.eth.defaultAccount = accounts[4].address
    await expect(proposal.stake(IProposalOutcome.Pass, toWei('10000000')).send()).rejects.toThrow(
      /insufficient balance/i
    )
  })

  it('throws a meaningful error if the proposal does not exist', async () => {
    const dao = await getTestDAO()
    // a non-existing proposal
    const proposal = new Proposal(
      '0x1aec6c8a3776b1eb867c68bccc2bf8b1178c47d7b6a5387cf958c7952da267c2', dao.address, arc
    )
    proposal.context.web3.eth.defaultAccount = accounts[2].address
    await expect(proposal.stake(IProposalOutcome.Pass, toWei('10000000')).send()).rejects.toThrow(
      /unknown proposal/i
    )
  })
})
