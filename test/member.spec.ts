import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO, IDAOState } from '../src/dao'
import { IMemberStaticState, Member } from '../src/member'
import { IProposalOutcome, Proposal } from '../src/proposal'
import { Stake } from '../src/stake'
import { Address } from '../src/types'
import { Vote } from '../src/vote'
import { createAProposal, fromWei,
  getTestDAO, newArc, toWei, waitUntilTrue } from './utils'

jest.setTimeout(60000)

/**
 * Member test
 */
describe('Member', () => {

  let arc: Arc
  let defaultAccount: Address
  let dao: DAO
  let daoState: IDAOState

  beforeAll(async () => {
    arc = await newArc()
    dao = await getTestDAO()
    daoState = await dao.state().pipe(first()).toPromise()
    defaultAccount = arc.web3.eth.defaultAccount
  })

  it('Member is instantiable', () => {
    const member = new Member({ address: defaultAccount, dao: dao.id, contract: daoState.reputation.address}, arc)
    expect(member).toBeInstanceOf(Member)
    const memberFromId = new Member('0xsomeId', arc)
    expect(memberFromId).toBeInstanceOf(Member)
  })

  it('Member state works', async () => {
    const members = await Member.search(arc, {where: { dao: dao.id}}).pipe(first()).toPromise()
    const member = members[0]
    const memberState = await member.state().pipe(first()).toPromise()
    expect(Number(memberState.reputation)).toBeGreaterThan(0)
    expect(memberState.dao).toBe(dao.id.toLowerCase())
  })

  it('Member is usable without knowing id or contract', async () => {
    const members = await Member.search(arc, {where: { dao: dao.id}}).pipe(first()).toPromise()
    const member = members[0]
    const memberState = await member.state().pipe(first()).toPromise()
    const newMember = new Member({dao: memberState.dao, address: memberState.address}, arc)
    const newMemberState = await newMember.state().pipe(first()).toPromise()
    expect(memberState).toEqual(newMemberState)
  })

  it('Member state also works if address has no reputation', async () => {
    const member = new Member({
      address: '0xe3016a92b6c728f5a55fe45029804de60148c689',
      contract: daoState.reputation.address,
      dao: dao.id
    }, arc)
    const memberState = await member.state().pipe(first()).toPromise()
    expect(Number(memberState.reputation)).toEqual(0)
    expect(memberState.address).toEqual('0xe3016a92b6c728f5a55fe45029804de60148c689')
    expect(memberState.dao).toBe(dao.id.toLowerCase())
  })

  it('Member proposals() works', async () => {
    const member = new Member({ address: defaultAccount, dao: dao.id, contract: daoState.reputation.address}, arc)
    let proposals: Proposal[] = []
    member.proposals().subscribe((next: Proposal[]) => proposals = next)
    // wait until the proposal has been indexed
    await waitUntilTrue(() => proposals.length > 0)

    expect(proposals.length).toBeGreaterThan(0)
    expect(proposals[0].id).toBeDefined()
  })

  it('Member stakes() works', async () => {
      const stakerAccount = arc.web3.eth.accounts.wallet[1].address
      const member = new Member({ address: stakerAccount, dao: dao.id, contract: daoState.reputation.address}, arc)
      const proposal = await createAProposal()
      const stakingToken =  await proposal.stakingToken()
      // mint tokens with defaultAccount
      await stakingToken.mint(stakerAccount, toWei('10000')).send()
      // switch the defaultAccount to a fresh one
      stakingToken.context.web3.eth.defaultAccount = stakerAccount
      const votingMachine = await proposal.votingMachine()
      await stakingToken.approveForStaking(votingMachine.options.address, toWei('1000')).send()

      await proposal.stake(IProposalOutcome.Pass, toWei('99')).send()
      let stakes: Stake[] = []
      member.stakes({ where: { proposal: proposal.id}}).subscribe(
        (next: Stake[]) => { stakes = next }
      )
      // wait until the proposal has been indexed
      await waitUntilTrue(() => stakes.length > 0)

      expect(stakes.length).toBeGreaterThan(0)
      const stakeState = await stakes[0].fetchStaticState()
      expect(stakeState.staker).toEqual(stakerAccount.toLowerCase())
      expect(fromWei(stakeState.amount)).toEqual('99')
      // clean up after test
      arc.web3.eth.defaultAccount = defaultAccount
    })

  it('Member votes() works', async () => {
    const member = new Member({ address: defaultAccount, dao: dao.id, contract: daoState.reputation.address}, arc)
    const proposal = await createAProposal()
    const votes: Vote[][] = []
    member.votes().subscribe((next: Vote[]) => votes.push(next))
    await waitUntilTrue(() => votes.length > 0)
    await proposal.vote(IProposalOutcome.Pass).send()
    await waitUntilTrue(() => votes.length > 1)
    expect(votes[votes.length - 1].length).toBeGreaterThan(0)
    const proposalIds: string[] = []
    await Promise.all(votes[votes.length - 1].map(async (vote) => {
      const voteState = await vote.fetchStaticState()
      proposalIds.push(voteState.proposal)
    }))
    expect(proposalIds).toContain(proposal.id)
  })

  it('Members are searchable', async () => {
    let members: Member[] = []

    Member.search(arc)
      .subscribe((result) => members = result)

    await waitUntilTrue(() => members.length !== 0)

    expect(members.length).toBeGreaterThanOrEqual(10)
  })

  it('paging and sorting works', async () => {
    const ls1 = await Member.search(arc, { first: 3, orderBy: 'address' }).pipe(first()).toPromise()
    expect(ls1.length).toEqual(3)
    expect((ls1[0].staticState as IMemberStaticState).address <=
      (ls1[1].staticState as IMemberStaticState).address).toBeTruthy()

    const ls2 = await Member.search(arc, { first: 2, skip: 2, orderBy: 'address' }).pipe(first()).toPromise()
    expect(ls2.length).toEqual(2)
    expect((ls1[2].staticState as IMemberStaticState).address)
      .toEqual((ls2[0].staticState as IMemberStaticState).address)

    const ls3 = await Member.search(arc, {  orderBy: 'address', orderDirection: 'desc'}).pipe(first()).toPromise()
    expect((ls3[0].staticState as IMemberStaticState).address >=
      (ls3[1].staticState as IMemberStaticState).address).toBeTruthy()
  })

  it('member: generate id is correctly', async () => {
    const members = await Member.search(arc).pipe(first()).toPromise()
    const member = members[0]
    const memberState = await member.state().pipe(first()).toPromise()
    expect(memberState.contract).toBeTruthy()
    const calculatedId = member.calculateId({contract: memberState.contract, address: memberState.address})
    expect(memberState.id).toEqual(calculatedId)
    //
    // const newMember = new Member(
    //   { contract: memberState.contract, dao: memberState.dao, address: memberState.address}, arc)
    // const newMemberStaticState = await newMember.fetchStaticState()
    // expect(newMemberStaticState.id).toEqual(memberState.id)
    // const newMemberState = await newMember.state().pipe(first()).toPromise()
    // expect(newMemberState.id).toEqual(memberState.id)
  })
})
