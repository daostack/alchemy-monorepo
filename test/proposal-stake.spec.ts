import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { IProposalOutcome, Proposal } from '../src/proposal'
import { Stake } from '../src/stake'
import { BN } from './utils'
import { createAProposal,
  // getTestAddresses,
  getTestDAO,
  // ITestAddresses,
  newArc,
  toWei,
  waitUntilTrue
} from './utils'

jest.setTimeout(20000)

describe('Stake on a ContributionReward', () => {
  let arc: Arc
  let web3: any
  let accounts: any
  // let addresses: ITestAddresses
  let dao: DAO
  // let executedProposal: Proposal

  beforeAll(async () => {
    arc = await newArc()
    web3 = arc.web3
    accounts = web3.eth.accounts.wallet
    // addresses = getTestAddresses()
    dao = await getTestDAO()
    // const { executedProposalId} = addresses.test
    // executedProposal = await dao.proposal(executedProposalId)
  })

  it('works and gets indexed', async () => {

    const proposal = await createAProposal(dao)
    const stakingToken =  await proposal.stakingToken()

    // approve the spend, for staking
    const votingMachine = await proposal.votingMachine()
    await stakingToken.approveForStaking(votingMachine.options.address, toWei('100')).send()

    const stake = await proposal.stake(IProposalOutcome.Pass, new BN(100)).send()

    const state =  await stake.result.fetchStaticState()
    expect(state).toMatchObject({
      outcome : IProposalOutcome.Pass
    })

    let stakes: Stake[] = []

    const stakeIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      stakes = await Stake.search(arc, {where: {proposal: proposal.id}}, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return stakes.length > 0
    }
    await waitUntilTrue(stakeIsIndexed)

    expect(stakes.length).toEqual(1)
  })

  it('throws a meaningful error if an insufficient amount tokens is approved for staking', async () => {
    const stakingToken =  arc.GENToken().contract()
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
    const proposal = await createAProposal(dao)
    proposal.context.web3.eth.defaultAccount = accounts[4].address
    await expect(proposal.stake(IProposalOutcome.Pass, toWei('10000000')).send()).rejects.toThrow(
      /insufficient balance/i
    )
  })

  it('throws a meaningful error if the proposal does not exist', async () => {
    // a non-existing proposal
    const proposal = new Proposal(
      '0x1aec6c8a3776b1eb867c68bccc2bf8b1178c47d7b6a5387cf958c7952da267c2',
      // dao.address,
      // executedProposal.schemeAddress,
      // executedProposal.votingMachineAddress,
      arc
    )

    proposal.context.web3.eth.defaultAccount = accounts[2].address
    await expect(proposal.stake(IProposalOutcome.Pass, toWei('10000000')).send()).rejects.toThrow(
      /No proposal/i
    )
  })
})
