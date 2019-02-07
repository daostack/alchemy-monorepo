// test from migration repo
import { Arc } from '../src/arc'
import {
  getArc,
  getContractAddresses,
  getOptions,
  getWeb3,
  nullAddress
} from './utils'

const DAOToken = require('@daostack/arc/build/contracts/DAOToken.json')
const GenesisProtocol = require('@daostack/arc/build/contracts/GenesisProtocol.json')
const GenesisProtocolCallbacks = require('@daostack/arc/build/contracts/GenesisProtocolCallbacksMock.json')
const Reputation = require('@daostack/arc/build/contracts/Reputation.json')

describe('GenesisProtocol', () => {
  let web3: any
  let addresses
  let genesisProtocol: any
  let accounts: any
  let daoToken: any
  let opts
  let reputation: any
  let genesisProtocolCallbacks: any
  let arc: Arc
  let paramsHash: any

  beforeAll(async () => {

    arc = getArc()
    web3 = await getWeb3()
    addresses = getContractAddresses()
    opts = await getOptions(web3)

    const Rep = new web3.eth.Contract(Reputation.abi, undefined, opts)
    reputation = await Rep.deploy({
      data: Reputation.bytecode,
      arguments: []
    }).send()

    genesisProtocol = new web3.eth.Contract(
      GenesisProtocol.abi,
      addresses.base.GenesisProtocol,
      opts
    )
    // genesisProtocol = arc.getContract('GenesisProtocol')

    daoToken = new web3.eth.Contract(DAOToken.abi, addresses.base.DAOToken, opts)

    genesisProtocolCallbacks = await new web3.eth.Contract(
      GenesisProtocolCallbacks.abi,
      undefined,
      opts
    )
      .deploy({
        data: GenesisProtocolCallbacks.bytecode,
        arguments: [
          reputation.options.address,
          daoToken.options.address,
          genesisProtocol.options.address
        ]
      })
      .send()

    accounts = web3.eth.accounts.wallet
    // await reputation.methods.transferOwnership(genesisProtocolCallbacks.options.address).send();
    const gpParams = {
      queuedVoteRequiredPercentage: 50,
      queuedVotePeriodLimit: 60,
      boostedVotePeriodLimit: 5,
      preBoostedVotePeriodLimit: 0,
      thresholdConst: 2000,
      quietEndingPeriod: 0,
      proposingRepReward: 60,
      votersReputationLossRatio: 10,
      minimumDaoBounty: 15,
      daoBountyConst: 10,
      activationTime: 0,
      voteOnBehalf: '0x0000000000000000000000000000000000000000'
    }
    const setParams = genesisProtocol.methods.setParameters(
      [
        gpParams.queuedVoteRequiredPercentage,
        gpParams.queuedVotePeriodLimit,
        gpParams.boostedVotePeriodLimit,
        gpParams.preBoostedVotePeriodLimit,
        gpParams.thresholdConst,
        gpParams.quietEndingPeriod,
        gpParams.proposingRepReward,
        gpParams.votersReputationLossRatio,
        gpParams.minimumDaoBounty,
        gpParams.daoBountyConst,
        gpParams.activationTime
      ],
      gpParams.voteOnBehalf
    )
    paramsHash = await setParams.call()
    await setParams.send()

    await daoToken.methods.mint(accounts[0].address, '100').send()

    await daoToken.methods.mint(accounts[1].address, '100').send()

    await daoToken.methods
      .approve(genesisProtocol.options.address, '100')
      .send()

    await reputation.methods.mint(accounts[0].address, '100').send()
    await reputation.methods.mint(accounts[1].address, '100').send()

  })

  it('This test will pass', async () => {
    const propose = genesisProtocolCallbacks.methods.propose(
      2,
      paramsHash,
      genesisProtocolCallbacks.options.address,
      accounts[1].address,
      nullAddress
    )
    const proposalId = await propose.call()

    await propose.send()

    // boost the proposal
    await genesisProtocol.methods.stake(proposalId, 1 /* YES */, 20).send()
  }, 15000)

  it('This test will fail on the stake transaction', async () => {

    const propose = genesisProtocol.methods.propose(2, paramsHash, accounts[1].address, nullAddress)
    const proposalId = await propose.call()
    await propose.send()

    // boost the proposal
    await genesisProtocol.methods.stake(proposalId, 1 /* YES */, 20).send()

  }, 15000)
})
