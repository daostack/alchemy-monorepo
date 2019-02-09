import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { IProposalState, Proposal, ProposalOutcome, ProposalStage } from '../src/proposal'
import { createAProposal, getArc,  getWeb3, waitUntilTrue} from './utils'

const DAOstackMigration = require('@daostack/migration')

/**
 * Proposal test
 */
describe('Proposal', () => {
  let arc: Arc
  let web3: any
  // let accounts: any

  beforeAll(async () => {
    arc = getArc()
    web3 = await getWeb3()
    // accounts = web3.eth.accounts.wallet
    // web3.eth.defaultAccount = accounts[0].address
  })

  it('Proposal is instantiable', () => {
    const id = 'some-id'
    const proposal = new Proposal(id, '', arc)
    expect(proposal).toBeInstanceOf(Proposal)
  })

  it('get list of proposals', async () => {
    const { Avatar, proposalId } = DAOstackMigration.migration('private').test
    const dao = arc.dao(Avatar.toLowerCase())
    const proposals = dao.proposals()
    const proposalsList = await proposals.pipe(first()).toPromise()
    expect(typeof proposalsList).toBe('object')
    expect(proposalsList.length).toBeGreaterThan(0)
    expect(proposalsList[proposalsList.length - 1].id).toBe(proposalId)
  })

  it('dao.proposals() accepts different query arguments', async () => {
    const { Avatar, proposalId } = DAOstackMigration.migration('private').test
    const dao = arc.dao(Avatar.toLowerCase())
    const proposals = await dao.proposals({ stage: ProposalStage.Queued}).pipe(first()).toPromise()
    expect(typeof proposals).toEqual(typeof [])
    expect(proposals.length).toBeGreaterThan(0)
    expect(proposals[proposals.length - 1].id).toBe(proposalId)
  })

  it('get proposal dao', async () => {
    const { Avatar, proposalId } = DAOstackMigration.migration('private').test

    const dao = arc.dao(Avatar.toLowerCase()).address
    const proposal = new Proposal(proposalId, dao, arc)
    // const proposalDao = await proposal.dao.pipe(first()).toPromise()
    expect(proposal).toBeInstanceOf(Proposal)
    expect(proposal.dao.address).toBe(dao)
  })

  it('Check proposal state is correct', async () => {
    const { proposalId } = DAOstackMigration.migration('private').test

    const proposal = new Proposal(proposalId, '', arc)
    const proposalState = await proposal.state.pipe(first()).toPromise()
    expect(proposal).toBeInstanceOf(Proposal)
    delete proposalState.dao
    delete proposalState.createdAt
    expect(proposalState).toMatchObject({
        beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
        boostedAt: 0,
        boostedVotePeriodLimit: 259200,
        boostingThreshold: 0,
        description: null,
        descriptionHash: '0x000000000000000000000000000000000000000000000000000000000000abcd',
        ethReward: 10,
        executedAt: null,
        externalTokenReward: 10,
        // id: '0xc31f2952787d52a41a2b2afd8844c6e295f1bed932a3a433542d4c420965028e',
        nativeTokenReward: 10,
        preBoostedVotePeriodLimit: 259200,
        proposer: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
        proposingRepReward: 5000000000,
        quietEndingPeriodBeganAt: null,
        reputationReward: 10,
        resolvedAt: null,
        stage: ProposalStage.Queued,
        stakesAgainst: 100000000000,
        stakesFor: 0,
        title: null,
        url: null,
        votesAgainst: 1e+21,
        votesFor: 1e+21,
        winningOutcome: 'Fail'
    })
  })

  it('get proposal rewards', async () => {
    const { proposalId } = DAOstackMigration.migration('private').test
    const proposal = new Proposal(proposalId, '', arc)
    const rewards = await proposal.rewards().pipe(first()).toPromise()
    return
    // TODO: fix this once the subgraph corretly indexes rewards
    // expect(rewards.length).toBeGreaterThan(0)
    // console.log(rewards)
    // const reward = rewards[0]
    // console.log(reward)
    //
    // expect(reward.proposal.id).toBe(proposalId)
  })

  it('get proposal stakes', async () => {
    const { proposalId } = DAOstackMigration.migration('private').test
    const proposal = new Proposal(proposalId, '', arc)
    const stakes = await proposal.stakes().pipe(first()).toPromise()
    expect(stakes.length).toEqual(0)
  })

  it('state gets all updates', async () => {
    // TODO: write this test!
    const states: IProposalState[] = []
    const proposal = await createAProposal()
    proposal.state.subscribe(
      (state: any) => {
        states.push(state)
      },
      (err: any) => {
        throw err
      }
    )
    // vote for the proposal
    await proposal.vote(ProposalOutcome.Pass).pipe(first()).toPromise()

    // wait until all transactions are indexed
    await waitUntilTrue(() => {
      if (states.length > 2 && states[states.length - 1].votesFor > 0) {
        console.log(states)
        return true
      } else {
        return false
      }
    })

    // we expect our first state to be null
    // (we just created the proposal and subscribed immediately)
    expect(states[0]).toEqual(null)
    expect(states[1]).toMatchObject({
      id: proposal.id,
      votesAgainst: 0,
      votesFor: 0,
      winningOutcome: 'Fail'
    })
    // TODO: the observable pushes (sometimes) also some intermediate "repeat" results
    // that seem to be ust copies of the first result (which is why we need the states.length-1 logic)
    // this is not very efficient and we should check if we improve that situation
    expect(states[states.length - 1].votesFor).toBeGreaterThan(0)
    expect(states[states.length - 1].winningOutcome).toEqual('Pass')
  })
})
