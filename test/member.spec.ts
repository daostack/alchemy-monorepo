import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Member } from '../src/member'
import { getArc, getWeb3 } from './utils'

/**
 * Member test
 */
describe('Member', () => {
  const id = 'some-id'

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

  it.skip('Member state works', async () => {
    const member = new Member(id, arc)
    const memberState = await member.state.pipe(first()).toPromise()
    expect(memberState.reputation).toEqual(10)
  })
})
