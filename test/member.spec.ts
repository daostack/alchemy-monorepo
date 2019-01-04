import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { Member } from '../src/member'
import { getArc, getWeb3 } from './utils'

/**
 * Member test
 */
describe('Member', () => {
  const id = '0xed311355e6510582a3b6699ffbb84e214ddb82871c0bdee04975d7a0f345a78c'

  let arc: Arc
  let web3: any
  let accounts: any

  beforeAll(async () => {
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
  })
})
