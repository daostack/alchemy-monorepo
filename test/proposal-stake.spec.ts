import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Proposal, ProposalOutcome } from '../src/proposal'
import { Stake } from '../src/stake'
import { createAProposal, getArc, getTestDAO, waitUntilTrue } from './utils'

describe('Stake on a ContributionReward', () => {
  let arc: Arc
  let web3: any
  let accounts: any

  beforeAll(async () => {
    arc = getArc()
    web3 = arc.web3
    accounts = web3.eth.accounts.wallet
    web3.eth.defaultAccount = accounts[0].address
  })

  it('works and gets indexed', async () => {
    const dao = await getTestDAO()
    const genesisProtocol = arc.getContract('GenesisProtocol')

    const proposal = await createAProposal(dao)
    const stakingToken =  await proposal.stakingToken()

    // apporve the spend, for staking
    const defaultAccount = web3.eth.defaultAccount
    await stakingToken.mint(defaultAccount, 10000).send()
    await stakingToken.approveForStaking(100).send()

    const stake = await proposal.stake(ProposalOutcome.Pass, 100).send()

    expect(stake.result).toMatchObject({
      outcome : ProposalOutcome.Pass
    })

    let stakes: Stake[] = []

    const stakeIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      stakes = await Stake.search(arc, {proposal: proposal.id}, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return stakes.length > 0
    }
    await waitUntilTrue(stakeIsIndexed)

    expect(stakes.length).toEqual(1)
  })

  it('throws a meaningful error if an insufficient amount tokens is approved for staking', async () => {
    const dao = await getTestDAO()
    const stakingToken =  arc.getContract('DAOToken')
    const proposal = await createAProposal(dao)
    await stakingToken.methods.mint(accounts[1].address, '100').send()
    proposal.context.web3.eth.defaultAccount = accounts[1].address
    await expect(proposal.stake(ProposalOutcome.Pass, 100).send()).rejects.toThrow(
      /insufficient allowance/i
    )

  })

  it('throws a meaningful error if then senders balance is too low', async () => {
    const dao = await getTestDAO()
    const proposal = await createAProposal(dao)
    proposal.context.web3.eth.defaultAccount = accounts[4].address
    await expect(proposal.stake(ProposalOutcome.Pass, 10000000).send()).rejects.toThrow(
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
    await expect(proposal.stake(ProposalOutcome.Pass, 10000000).send()).rejects.toThrow(
      /unknown proposal/i
    )
  })
})
