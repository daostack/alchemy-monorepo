import { first } from 'rxjs/operators'
import { Arc, CL4RScheme } from '../src'
import { newArc } from './utils'
import BN = require('bn.js')
import {Decimal} from 'decimal.js';
import { createAProposal, getTestAddresses, getTestDAO, voteToPassProposal, waitUntilTrue} from './utils'
import {
  IProposalState,
  IProposalType,
  IProposalStage
  } from '../src/proposal'
jest.setTimeout(60000)
/**
 * Scheme test
 */
describe('Scheme', () => {

  let arc: Arc
  let accounts: any

  const agreementHash = '0x0000000000000000000000000000000000000001000000000000000000000000'
  let continuousLocking4ReputationAddress : any
  let dao : any
  let proposalToAdd :any
  let token :any
  const REP_CONST_A = '85000000000000000000000'
  beforeAll(async () => {
    arc = await newArc()
    token = arc.GENToken()

    accounts = arc.web3.eth.accounts.wallet
    const contractInfoFactory = arc.getContractInfoByName('ContinuousLocking4ReputationFactory', '0.0.1-rc.55')
    const continuousLocking4ReputationFactory = arc.getContract(contractInfoFactory.address)

    // Avatar _avatar,
    // uint256 _reputationReward,
    // uint256 _startTime,
    // uint256 _batchTime,
    // uint256 _redeemEnableTime,
    // uint256 _maxLockingBatches,
    // uint256 _repRewardConstA,
    // uint256 _repRewardConstB,
    // uint256 _batchesIndexCap,
    // IERC20 _token,
    // bytes32 _agreementHash
    dao = await getTestDAO()
    const startTime = (await arc.web3.eth.getBlock('latest')).timestamp
    const redeemEnableTime = startTime + 1000

    continuousLocking4ReputationAddress = await continuousLocking4ReputationFactory.methods.createCL4R(
      dao.id,
      new BN('10000000000000000000000000'),
      startTime,
      new BN('1000'),
      redeemEnableTime,
      new BN('12'),
      new BN(REP_CONST_A),
      new BN('900'),
      new BN('5'),
      token.address,
      agreementHash
    ).call()

    await continuousLocking4ReputationFactory.methods.createCL4R(
      dao.id,
      new BN('10000000000000000000000000'),
      startTime,
      new BN('1000'),
      redeemEnableTime,
      new BN('12'),
      new BN(REP_CONST_A),
      new BN('900'),
      new BN('5'),
      token.address,
      agreementHash
    ).send({gas: 2000000, from:accounts[0].address})
    //now register that to a dao

    proposalToAdd = await createAProposal(dao, {
      descriptionHash: '',
      parametersHash: '0x0000000000000000000000000000000000000000000000000000000000001234',
      permissions: '0x0000001f',
      scheme: getTestAddresses(arc).base.SchemeRegistrar,
      schemeToRegister: continuousLocking4ReputationAddress,
      type: IProposalType.SchemeRegistrarAdd
    })
    // accept the proposal by voting the hell out of it
    await voteToPassProposal(proposalToAdd)
    await proposalToAdd.execute()

  })

  it('lock and extend lock', async () => {
    // check if proposal is indeed accepted etc
    const states: IProposalState[] = []
    const lastState = () => states[states.length - 1]
    proposalToAdd.state().subscribe(((next: any) => states.push(next)))

    await waitUntilTrue(() => {
      return lastState() && lastState().stage === IProposalStage.Executed
    })
    const schemes = await dao.schemes({ where: { address: continuousLocking4ReputationAddress.toLowerCase() } }).pipe(first()).toPromise()
    const scheme = schemes[0]
    expect(scheme.CTL4R).not.toBeFalsy()
    const cl4r = scheme.CTL4R as CL4RScheme
    await cl4r.getScheme().context.fetchContractInfos({fetchPolicy: 'network-only'})
    expect(await cl4r.getAgreementHash()).toEqual(agreementHash)
    const lockAmount = new BN('300')
    await token.approveForStaking(continuousLocking4ReputationAddress.toLowerCase(), lockAmount).send()
    await token.mint(accounts[0].address, lockAmount).send()
    await arc.fetchContractInfos({fetchPolicy: 'network-only'})
    const continuousLocking4ReputationContract = arc.getContract(continuousLocking4ReputationAddress.toLowerCase())
    const lockCounterBefore = await continuousLocking4ReputationContract.methods.lockCounter().call()
    await cl4r.lock(lockAmount,1,0,agreementHash).send()
    const lockCounterAfter = await continuousLocking4ReputationContract.methods.lockCounter().call()
    expect(Number(lockCounterBefore)+1).toEqual(Number(lockCounterAfter))
    const reputationRewardPerPeriod = new Decimal(REP_CONST_A)
    const A = await continuousLocking4ReputationContract.methods.repRewardConstA().call()
    const B = await continuousLocking4ReputationContract.methods.repRewardConstB().call()
    const repreward = await cl4r.getReputationRewardForLockingIds([lockCounterAfter],0,reputationRewardPerPeriod)
    expect(repreward).toEqual(reputationRewardPerPeriod)
    expect(await cl4r.getRepuationRewardForBatch(A,B,0)).toEqual(reputationRewardPerPeriod)
    await cl4r.extendLocking(2,0,lockCounterAfter,agreementHash).send()

  })
})
