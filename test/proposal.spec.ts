import { Arc } from '../src/arc'
import { Proposal } from '../src/proposal'
import { getArc, getContractAddresses } from './utils'

/**
 * Proposal test
 */
describe('Proposal', () => {
  let addresses: { [key: string]: string }
  let arc: Arc

  beforeAll(() => {
    addresses = getContractAddresses()
    arc = getArc()
  })

  it('Proposal is instantiable', () => {
    const id = 'some-id'
    const proposal = new Proposal(id, arc)
    expect(proposal).toBeInstanceOf(Proposal)
  })
})
