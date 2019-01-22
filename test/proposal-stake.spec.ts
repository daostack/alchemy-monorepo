import { first, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { ProposalOutcome } from '../src/proposal'
import { Stake } from '../src/stake'
import { createAProposal, getArc, waitUntilTrue } from './utils'

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
    const dao = new DAO(arc.contractAddresses.Avatar, arc)
    const genesisProtocol = arc.getContract('GenesisProtocol')
    const stakingToken =  arc.getContract('DAOToken')

    const proposal = await createAProposal(dao)

    // apporve the spend, for staking
    await stakingToken.methods
      .approve(genesisProtocol.options.address, '100')
      .send()

    // check preconditios
    const defaultAccount = web3.eth.defaultAccount

    // TODO: implement error handling as part of the stake function..
    // One type of error is that the proposalId is not known:
    const prop = await genesisProtocol.methods.proposals(proposal.id).call()
    expect(prop.proposer).toEqual(defaultAccount)

    // the staking conract is the one we expect
    const stakingTokenAddress = await genesisProtocol.methods.stakingToken().call()
    expect(stakingTokenAddress).toEqual(stakingToken.options.address)
    // staker has sufficient balance
    await stakingToken.methods.mint(defaultAccount, '10000').send()
    const balance = await stakingToken.methods.balanceOf(defaultAccount).call()
    expect(Number(balance)).toBeGreaterThanOrEqual(10000)

    // staker has approved the token spend
    const allowance = await stakingToken.methods.allowance(defaultAccount, genesisProtocol.options.address).call()
    expect(Number(allowance)).toBeGreaterThanOrEqual(100)
    // end preconditions check

    const stake = await proposal.stake(ProposalOutcome.Pass, 100).pipe(take(2)).toPromise()

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
})
