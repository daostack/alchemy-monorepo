import { first } from 'rxjs/operators'
import { Arc, ReputationFromTokenScheme } from '../src'
import { newArc } from './utils'

jest.setTimeout(60000)
/**
 * Scheme test
 */
describe('Scheme', () => {

  let arc: Arc
  const agreementHash = '0x0000000000000000000000000000000000000001000000000000000000000000'
  beforeAll(async () => {
    arc = await newArc()
  })

  it('version 0.0.1-rc.32', async () => {
    const schemeContractInfo = arc.getContractInfoByName('ReputationFromToken', '0.0.1-rc.32')
    const schemes = await arc.schemes({ where: {address: schemeContractInfo.address}})
      .pipe(first()).toPromise()
    const scheme = schemes[0]
    expect(scheme.ReputationFromToken).not.toBeFalsy()
    const reputationFromToken = scheme.ReputationFromToken as ReputationFromTokenScheme
    // const amount = await scheme.ReputationFromToken.redemptionAmount(arc.web3.eth.defaultAccount)
    // expect(amount).toEqual(0)
    const redemptionPromise = reputationFromToken.redeem(arc.web3.eth.defaultAccount).send()
    // TODO: the transaction reverts, for erasons to check :-/
    await expect(redemptionPromise).rejects.toThrow('revert')
  })
  it('version 0.0.1-rc.34', async () => {
    const schemeContractInfo = arc.getContractInfoByName('ReputationFromToken', '0.0.1-rc.34')
    const schemes = await arc.schemes({ where: {address: schemeContractInfo.address}})
      .pipe(first()).toPromise()
    const scheme = schemes[0]
    const reputationFromToken = scheme.ReputationFromToken as ReputationFromTokenScheme
    await expect(reputationFromToken.redeem(
      arc.web3.eth.defaultAccount,
      '0x01234' // <- wrong hash
    ).send()).rejects.toThrow('must send the right agreementHash')

    // TODO: this reverst, would be nice to have a working test
    await expect(reputationFromToken.redeem(
      arc.web3.eth.defaultAccount,
      agreementHash // <- right hash
    ).send()).rejects.toThrow('revert')
   })

  it('getAgreementHash works', async () => {
    const schemeContractInfo = arc.getContractInfoByName('ReputationFromToken', '0.0.1-rc.34')
    const schemes = await arc.schemes({ where: {address: schemeContractInfo.address}})
      .pipe(first()).toPromise()
    const scheme = schemes[0]
    const reputationFromToken = scheme.ReputationFromToken as ReputationFromTokenScheme
    expect(await reputationFromToken.getAgreementHash()).toEqual(agreementHash)

  })
})
