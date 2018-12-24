import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Proposal, ProposalStage } from '../src/proposal'
import { getArc, getContractAddresses, getOptions, getWeb3, nullAddress } from './utils'

const DAOToken = require('@daostack/arc/build/contracts/DAOToken.json')
const GenesisProtocol = require('@daostack/arc/build/contracts/GenesisProtocol.json')
const GenesisProtocolCallbacks = require('@daostack/arc/build/contracts/GenesisProtocolCallbacksMock.json')
const Reputation = require('@daostack/arc/build/contracts/Reputation.json')

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

  it.skip('get list of proposals', async () => {
    let genesisProtocol: any
    let daoToken: any
    let reputation: any
    let genesisProtocolCallbacks: any

    const Rep = new web3.eth.Contract(Reputation.abi, undefined, opts)
    reputation = await Rep.deploy({
        arguments: [],
        data: Reputation.bytecode
      }).send()

    genesisProtocol = new web3.eth.Contract(
        GenesisProtocol.abi,
        addresses.GenesisProtocol,
        opts
      )

    daoToken = new web3.eth.Contract(DAOToken.abi, addresses.DAOToken, opts)

    genesisProtocolCallbacks = await new web3.eth.Contract(
        GenesisProtocolCallbacks.abi,
        undefined,
        opts
      ).deploy({
          arguments: [
            reputation.options.address,
            daoToken.options.address,
            genesisProtocol.options.address
          ],
          data: GenesisProtocolCallbacks.bytecode
        }).send()

    console.log(genesisProtocolCallbacks)

    const params = [
        50, // preBoostedVoteRequiredPercentage
        60, // preBoostedVotePeriodLimit
        5, // boostedVotePeriodLimit
        1, // thresholdConstA
        1, // thresholdConstB
        0, // minimumStakingFee
        0, // quietEndingPeriod
        60, // proposingRepRewardConstA
        1, // proposingRepRewardConstB
        10, // stakerFeeRatioForVoters
        10, // votersReputationLossRatio
        80, // votersGainRepRatioFromLostRep
        15, // _daoBountyConst
        10 // _daoBountyLimit
      ]

    const setParams = genesisProtocol.methods.setParameters(
      params,
      nullAddress
    )
    const paramsHash = await setParams.call()
    await setParams.send()

    const propose = await genesisProtocolCallbacks.methods.propose(
      2,
      paramsHash,
      genesisProtocolCallbacks.options.address,
      accounts[1].address,
      nullAddress
    )

    const proposalId = await propose.call()

    await propose.send()

    const dao = arc.dao(addresses.Avatar.toLowerCase())
    const proposals = dao.proposals()
    const proposalsList = await proposals.pipe(first()).toPromise()
    expect(typeof proposalsList).toBe('object')
    expect(proposalsList.length).toBeGreaterThan(0)
    // expect(proposalsList[proposalsList.length - 1].).toBe(addresses.Avatar.toLowerCase())

  })

  it('dao.proposals() should work', async () => {
    // TODO: because we have not setup with proposals, we are only testing if the current state returns the emty list
    const dao = arc.dao(addresses.Avatar.toLowerCase())
    const proposals = await dao.proposals().pipe(first()).toPromise()
    expect(typeof proposals).toEqual(typeof [])
    // const proposal = proposals[0]
    // const proposalState = await proposal.state.pipe(first()).toPromise()
    // expect(proposalState).toEqual('something')

  })

  it('dao.proposals() accepts different query arguments', async () => {
    // TODO: because we have not setup with proposals, we are only testing if the current state returns the emty list
    const dao = arc.dao(addresses.Avatar.toLowerCase())
    const proposals = await dao.proposals({ stage: ProposalStage.Open}).pipe(first()).toPromise()
    expect(typeof proposals).toEqual(typeof [])
    // const proposal = proposals[0]
    // const proposalState = await proposal.state.pipe(first()).toPromise()
    // expect(proposalState).toEqual('something')

  })
})
