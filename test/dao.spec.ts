import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { getArc, getContractAddresses, getWeb3, getOptions, nullAddress } from './utils'

const DAOToken = require('@daostack/arc/build/contracts/DAOToken.json');
const GenesisProtocol = require('@daostack/arc/build/contracts/GenesisProtocol.json');
const GenesisProtocolCallbacks = require('@daostack/arc/build/contracts/GenesisProtocolCallbacksMock.json');
const Reputation = require('@daostack/arc/build/contracts/Reputation.json');

/**
 * DAO test
 */
describe('DAO', () => {
  let addresses: { [key: string]: string }
  let arc: Arc
  let web3: any
  let opts: any
  let accounts: any
  let genesisProtocol: any
  let daoToken: any
  let reputation: any
  let genesisProtocolCallbacks: any

  beforeAll(async () => {
    addresses = getContractAddresses()
    arc = getArc()
    web3 = await getWeb3()
    accounts = web3.eth.accounts.wallet;
    web3.eth.defaultAccount = accounts[0].address;
    opts = await getOptions(web3)

    const Rep = new web3.eth.Contract(Reputation.abi, undefined, opts);
    reputation = await Rep.deploy({
      data: Reputation.bytecode,
      arguments: [],
    }).send();

    genesisProtocol = new web3.eth.Contract(
      GenesisProtocol.abi,
      addresses.GenesisProtocol,
      opts,
    );

    daoToken = new web3.eth.Contract(DAOToken.abi, addresses.DAOToken, opts);

    genesisProtocolCallbacks = await new web3.eth.Contract(
      GenesisProtocolCallbacks.abi,
      undefined,
      opts,
    ).deploy({
        data: GenesisProtocolCallbacks.bytecode,
        arguments: [
          reputation.options.address,
          daoToken.options.address,
          genesisProtocol.options.address,
        ],
      }).send();

      console.log(genesisProtocolCallbacks)
  })

  it('DAO is instantiable', () => {
    const address = '0xa2A064b3B22fC892dfB71923a6D844b953AA247C'
    const dao = new DAO(address, arc)
    expect(dao).toBeInstanceOf(DAO)
  })

  it('should be possible to get the token balance of the DAO', () => {
    // const { token } = await dao.state.toPromise()
    // const balance = await token.balanceOf(address).toPromise()
  })

  it('should be possible to get the reputation balance of the DAO', () => {
    // const { reputation } = await dao.state.toPromise()
    // const balance = await reputation.balanceOf(address).toPromise()
  })

  it('get the list of daos', async () => {
    const daos = arc.daos()
    const daoList = await daos.pipe(first()).toPromise()
    expect(typeof daoList).toBe('object')
    expect(daoList.length).toBeGreaterThan(0)
    expect(daoList[daoList.length - 1].address).toBe(addresses.Avatar.toLowerCase())
  })

  it('get the dao state', async () => {
    const dao = arc.dao(addresses.Avatar.toLowerCase())
    expect(dao).toBeInstanceOf(DAO)
    const state = await dao.state.pipe(first()).toPromise()
    const expected = {
       address: addresses.Avatar.toLowerCase(),
       members: 0,
       name: 'Genesis Test'
    }
    expect(state).toMatchObject(expected)
    expect(Object.keys(state)).toEqual(['address', 'members', 'name', 'reputation', 'reputationTotalSupply',
      'token', 'tokenName', 'tokenSymbol', 'tokenTotalSupply'])
  })

  it('get list of proposals', async () => {
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
      10, // _daoBountyLimit
    ];

    const setParams = genesisProtocol.methods.setParameters(
      params,
      nullAddress,
    );
    const paramsHash = await setParams.call();
    await setParams.send();


    const propose = await genesisProtocolCallbacks.methods.propose(
      2,
      paramsHash,
      genesisProtocolCallbacks.options.address,
      accounts[1].address,
      nullAddress,
    );

    const proposalId = await propose.call();

    await propose.send()

    const dao = arc.dao(addresses.Avatar.toLowerCase())
    const proposals = dao.proposals()

    const proposalsList = await proposals.pipe(first()).toPromise()
    expect(typeof proposalsList).toBe('object')
    expect(proposalsList.length).toBeGreaterThan(0)
    //expect(proposalsList[proposalsList.length - 1].).toBe(addresses.Avatar.toLowerCase())

  })

  it('throws a reasonable error if the contract does not exist', async () => {
    expect.assertions(1)
    const reputation = new DAO('0xfake', arc)
    await expect(reputation.state.toPromise()).rejects.toThrow(
      'Could not find a DAO with address 0xfake'
    )
  })
})
