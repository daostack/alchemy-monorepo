import { first} from 'rxjs/operators'
import { Arc, IContractAddresses } from '../src/arc'
import { DAO } from '../src/dao'
import { Member } from '../src/member'
import { IProposalOutcome, Proposal } from '../src/proposal'
import { Stake } from '../src/stake'
import { Address } from '../src/types'
import { Vote } from '../src/vote'
import { createAProposal, fromWei, getContractAddressesFromMigration,
  getTestDAO, IContractAddressesFromMigration, newArc, toWei, waitUntilTrue } from './utils'

jest.setTimeout(10000)

/**
 * Member test
 */
describe('Member', () => {

  let addresses: IContractAddressesFromMigration
  let arc: Arc
  let defaultAccount: Address
  let dao: DAO

  beforeAll(async () => {
    addresses = getContractAddressesFromMigration()
    arc = await newArc()
    dao = await getTestDAO()
    defaultAccount = arc.web3.eth.defaultAccount
  })

  it('Member is instantiable', () => {
    const member = new Member(defaultAccount, dao.address, arc)
    expect(member).toBeInstanceOf(Member)
  })

  it('Member state works', async () => {
    const member = new Member(defaultAccount, dao.address, arc)
    const memberState = await member.state().pipe(first()).toPromise()
    expect(Number(fromWei(memberState.reputation))).toBeGreaterThan(0)
    expect(Number(fromWei(memberState.tokens))).toBeGreaterThan(0)
    expect(memberState.dao).toBeInstanceOf(DAO)
    expect(memberState.address).toEqual(defaultAccount)
    expect(memberState.dao.address).toBe(dao.address.toLowerCase())
  })

  it('Member state also works for members that are not in the index', async () => {
    const someAddress = '0xe74f3c49c162c00ac18b022856e1a4ecc8947c42'
    const member = new Member(someAddress, dao.address, arc)
    const memberState = await member.state().pipe(first()).toPromise()
    expect(fromWei(memberState.reputation)).toEqual('0')
    expect(memberState.address).toEqual(someAddress)
  })

  it('Member proposals() works', async () => {
    const member = new Member(defaultAccount, dao.address, arc)
    const proposal = await createAProposal()
    let proposals: Proposal[] = []
    member.proposals().subscribe((next: Proposal[]) => proposals = next)
    // wait until the proposal has been indexed
    await waitUntilTrue(() => proposals.length > 0)

    expect(proposals.length).toBeGreaterThan(0)
    expect(proposals[0].id).toBeDefined()
  })

  it('Member stakes() works', async () => {
      const stakerAccount = arc.web3.eth.accounts.wallet[1].address
      const member = new Member(stakerAccount, dao.address, arc)
      const proposal = await createAProposal()
      const stakingToken =  await proposal.stakingToken()
      // mint tokens with defaultAccount
      await stakingToken.mint(stakerAccount, toWei('10000')).send()
      // switch the defaultAccount to a fresh one
      stakingToken.context.web3.eth.defaultAccount = stakerAccount
      await stakingToken.approveForStaking(toWei('1000')).send()

      await proposal.stake(IProposalOutcome.Pass, toWei('99')).send()
      let stakes: Stake[] = []
      member.stakes({ proposal: proposal.id}).subscribe(
        (next: Stake[]) => { stakes = next }
      )
      // wait until the proposal has been indexed
      await waitUntilTrue(() => stakes.length > 0)

      expect(stakes.length).toBeGreaterThan(0)
      expect(stakes[0].staker).toEqual(stakerAccount.toLowerCase())
      expect(fromWei(stakes[0].amount)).toEqual('99')
      // clean up after test
      arc.web3.eth.defaultAccount = defaultAccount
    })

  it('Member votes() works', async () => {
    const member = new Member(defaultAccount, dao.address, arc)
    const proposal = await createAProposal()
    const votes: Vote[][] = []
    member.votes().subscribe((next: Vote[]) => votes.push(next))
    await waitUntilTrue(() => votes.length > 0)
    await proposal.vote(IProposalOutcome.Pass).send()
    await waitUntilTrue(() => votes.length > 1)
    expect(votes[votes.length - 1].length).toBeGreaterThan(0)
    expect(votes[votes.length - 1].map((vote) => vote.proposalId)).toContain(proposal.id)
  })

  it('Members are searchable', async () => {
    let members: Member[] = []

    Member.search({}, arc)
      .subscribe((result) => members = result)

    await waitUntilTrue(() => members.length !== 0)

    expect(members.length).toBeGreaterThanOrEqual(15)
  })
})
