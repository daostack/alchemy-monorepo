import { Member } from '../src/member'

/**
 * Member test
 */
describe('Member', () => {
  it('Member is instantiable', () => {
    const id = 'some-id'
    const address = '0xa2A064b3B22fC892dfB71923a6D844b953AA247C'
    const daoAddress = '0xa2A064b3B22fC892dfB71923a6D844b953AA247C'

    const member = new Member(address, daoAddress)
    expect(member).toBeInstanceOf(Member)
  })
})
