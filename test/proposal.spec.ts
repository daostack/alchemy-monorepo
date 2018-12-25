import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Proposal, ProposalStage } from '../src/proposal'
import { getArc, getContractAddresses, getOptions, getWeb3, nullAddress } from './utils'

const DAOToken = require('@daostack/arc/build/contracts/DAOToken.json')
const GenesisProtocol = require('@daostack/arc/build/contracts/GenesisProtocol.json')
const GenesisProtocolCallbacks = require('@daostack/arc/build/contracts/GenesisProtocolCallbacksMock.json')
const Reputation = require('@daostack/arc/build/contracts/Reputation.json')

const DAOstackMigration = require('@daostack/migration');

/**
 * Proposal test
 */
describe('Proposal', () => {
  let addresses: { [key: string]: string }
  let arc: Arc
  let web3: any
  let opts: any
  let accounts: any

  beforeAll(async () => {
    addresses = getContractAddresses()
    arc = getArc()
    web3 = await getWeb3()
    accounts = web3.eth.accounts.wallet
    web3.eth.defaultAccount = accounts[0].address
    opts = await getOptions(web3)
  })

  it('Proposal is instantiable', () => {
    const id = 'some-id'
    const proposal = new Proposal(id, arc)
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
    // TODO: because we have not setup with proposals, we are only testing if the current state returns the emty list
    const dao = arc.dao(Avatar.toLowerCase())
    const proposals = await dao.proposals({ stage: ProposalStage.Open}).pipe(first()).toPromise()
    expect(typeof proposals).toEqual(typeof [])
    expect(proposals.length).toBeGreaterThan(0)
    expect(proposals[proposals.length - 1].id).toBe(proposalId)
  })
})
