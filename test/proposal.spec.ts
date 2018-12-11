import { Proposal } from '../src/proposal'

/**
 * Proposal test
 */
describe('Proposal', () => {
  it('Proposal is instantiable', () => {
    const id = 'some-id'
    const proposal = new Proposal(id)
    expect(proposal).toBeInstanceOf(Proposal)
  })
})
