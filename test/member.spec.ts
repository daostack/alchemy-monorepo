import { first} from 'rxjs/operators'
import { Arc, IContractAddresses } from '../src/arc'
import { DAO } from '../src/dao'
import { Member } from '../src/member'
import { getArc, getContractAddresses, getWeb3 } from './utils'

const DAOstackMigration = require('@daostack/migration')

/**
 * Member test
 */
describe('Member', () => {
  let id = '0x07090158a93a8512293f75197c0da4d60d3997596474d141c8610479abe9beab'

  let addresses: IContractAddresses
  let arc: Arc
  let web3: any
  let accounts: any

  beforeAll(async () => {
    addresses = getContractAddresses()
    arc = getArc()
    web3 = await getWeb3()
    accounts = web3.eth.accounts.wallet
    web3.eth.defaultAccount = accounts[0].address
  })

  it('Member is instantiable', () => {
    const member = new Member(id, arc)
    expect(member).toBeInstanceOf(Member)
  })

  it('Member state works', async () => {
    const member = new Member(id, arc)
    const memberState = await member.state.pipe(first()).toPromise()
    expect(memberState.reputation).toEqual(1e21)
    expect(memberState.tokens).toEqual(1e21)
    expect(memberState.dao).toBeInstanceOf(DAO)
    expect(memberState.dao.address).toBe(addresses.dao.Avatar.toLowerCase())
  })

  it('Member proposals works', async () => {
    id = '0x1cea1e112ec409762ab4795daead616b5a3acf72879303434a87cbcd3a1785b9'
    const member = new Member(id, arc)
    const proposals = await member.proposals().pipe(first()).toPromise()
    expect(proposals.length).toBeGreaterThan(0)
    expect(proposals[0].id).toBeDefined()
  })

  it('Member votes works', async () => {

    id = '0x40163b1a33965a2d41f1c2888cdd2ffec4b5fb25a5071846bfbece19c8e13a81'
    const member = new Member(id, arc)
    const votes = await member.votes().pipe(first()).toPromise()
    expect(votes.length).toBeGreaterThan(0)
    const vote = votes[0]
    expect(vote.proposalId).toBeDefined()
  })
})
