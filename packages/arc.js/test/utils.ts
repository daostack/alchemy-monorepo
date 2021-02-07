import BN = require('bn.js')
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { IContractInfo, IProposalCreateOptions, Proposal } from '../src'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { IProposalOutcome } from '../src/proposal'
import { Reputation } from '../src/reputation'
import { Address } from '../src/types'

const Web3 = require('web3')
const path = require('path')

export const graphqlHttpProvider: string = 'http://127.0.0.1:8000/subgraphs/name/daostack'
export const graphqlHttpMetaProvider: string = 'http://127.0.0.1:8000/subgraphs'
export const graphqlWsProvider: string = 'http://127.0.0.1:8001/subgraphs/name/daostack'
export const web3Provider: string = 'ws://127.0.0.1:8545'
export const ipfsProvider: string = 'http://127.0.0.1:5001/api/v0'

export const LATEST_ARC_VERSION = '0.0.1-rc.32'

export { BN }

export function padZeros(str: string, max = 36): string {
  str = str.toString()
  return str.length < max ? padZeros('0' + str, max) : str
}

const pks = [
  // default accounts of ganache
  '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d', // 0
  '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1', // 1
  '0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c', // 2
  '0x646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913', // 3
  '0xadd53f9a7e588d003326d1cbf9e4a43c061aadd9bc938c843a79e7b4fd2ad743', // 4
  '0x395df67f0c2d2d9fe1ad08d1bc8b6627011959b79c53d7dd6a3536a33ab8a4fd', // 5
  '0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773' // 9
]

export function fromWei(amount: BN): string {
  return Web3.utils.fromWei(amount, 'ether')
}

export function toWei(amount: string | number): BN {
  return new BN(Web3.utils.toWei(amount.toString(), 'ether'))
}

export interface ITestAddresses {
  base: { [key: string]: Address },
  dao: { [key: string]: Address },
  test: {
    organs: { [key: string]: Address },
    Avatar: Address,
    boostedProposalId: Address,
    executedProposalId: Address,
    queuedProposalId: Address,
    preBoostedProposalId: Address,
    [key: string]: Address | { [key: string]: Address }
  }
}

export function getTestAddresses(arc: Arc, version: string = LATEST_ARC_VERSION): ITestAddresses {
  // const contractInfos = arc.contractInfos
  const migrationFile = path.resolve(`${require.resolve('@daostack/migration')}/../migration.json`)
  const migration = require(migrationFile).private
  let UGenericScheme: string = ''
  try {
    UGenericScheme = arc.getContractInfoByName('GenericScheme', version).address
  } catch (err) {
    if (err.message.match(/no contract/i)) {
      // pass
    } else {
      throw err
    }
  }

  const addresses = {
    base: {
      ContributionReward: arc.getContractInfoByName('ContributionReward', version).address,
      GEN: arc.GENToken().address,
      GenericScheme: arc.getContractInfoByName('GenericScheme', version).address,
      SchemeRegistrar: arc.getContractInfoByName('SchemeRegistrar', version).address,
      UGenericScheme
    },
    dao: migration.dao[version],
    test: migration.test[version]
  }
  return addresses

}
export async function getOptions(web3: any) {
  const block = await web3.eth.getBlock('latest')
  return {
    from: web3.eth.defaultAccount,
    gas: block.gasLimit - 100000
  }
}

export async function newArc(options: { [key: string]: any } = {}): Promise<Arc> {
  const defaultOptions = {
    graphqlHttpProvider,
    graphqlWsProvider,
    ipfsProvider,
    web3Provider
  }
  const arc = new Arc(Object.assign(defaultOptions, options))
  // get the contract addresses from the subgraph
  await arc.fetchContractInfos()
  for (const pk of pks) {
    const account = arc.web3.eth.accounts.privateKeyToAccount(pk)
    arc.web3.eth.accounts.wallet.add(account)
  }
  arc.web3.eth.defaultAccount = arc.web3.eth.accounts.wallet[0].address
  return arc
}

/**
 * Arc without a valid ethereum connection
 * @return [description]
 */
export async function newArcWithoutEthereum(): Promise<Arc> {
  const arc = new Arc({
    graphqlHttpProvider,
    graphqlWsProvider
  })
  return arc
}

/**
 * Arc instance without a working graphql connection
 * @return [description]
 */

export async function newArcWithoutGraphql(): Promise<Arc> {
  const arc = new Arc({
    ipfsProvider,
    web3Provider
  })
  const normalArc = await newArc()
  arc.setContractInfos(normalArc.contractInfos)
  return arc
}

export async function getTestDAO(arc?: Arc, version: string = LATEST_ARC_VERSION) {
  if (!arc) {
    arc = await newArc()
  }
  const addresses = await getTestAddresses(arc, version)
  if (!addresses.test.Avatar) {
    const msg = `Expected to find ".test.avatar" in the migration file, found ${addresses} instead`
    throw Error(msg)
  }
  return arc.dao(addresses.test.Avatar)
}

export async function createAProposal(
  dao?: DAO,
  options: any = {}
) {
  if (!dao) {
    dao = await getTestDAO()
  }
  options = {
    beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
    ethReward: toWei('300'),
    externalTokenAddress: undefined,
    externalTokenReward: toWei('0'),
    nativeTokenReward: toWei('1'),
    periodLength: 0,
    periods: 1,
    reputationReward: toWei('10'),
    scheme: getTestAddresses(dao.context).base.ContributionReward,
    ...options
  }

  const response = await (dao as DAO).createProposal(options as IProposalCreateOptions).send()
  const proposal = response.result as Proposal
  // wait for the proposal to be indexed
  let indexed = false
  proposal.state().subscribe((next: any) => { if (next) { indexed = true } })
  await waitUntilTrue(() => indexed)
  return proposal
}

export async function mintSomeReputation(version: string = LATEST_ARC_VERSION) {
  const arc = await newArc()
  const addresses = getTestAddresses(arc, version)
  const token = new Reputation(addresses.test.organs.DemoReputation, arc)
  const accounts = arc.web3.eth.accounts.wallet
  await token.mint(accounts[1].address, new BN('99')).send()
}

export function mineANewBlock() {
  return mintSomeReputation()
}

export async function waitUntilTrue(test: () => Promise<boolean> | boolean) {
  return new Promise((resolve) => {
    (async function waitForIt(): Promise<void> {
      if (await test()) { return resolve() }
      setTimeout(waitForIt, 100)
    })()
  })
}

// Vote and vote and vote for proposal until it is accepted
export async function voteToPassProposal(proposal: Proposal) {
  const arc = proposal.context
  const accounts = arc.web3.eth.accounts.wallet
  // make sure the proposal is indexed
  await waitUntilTrue(async () => {
    const state = await proposal.state({ fetchPolicy: 'network-only' }).pipe(first()).toPromise()
    return !!state
  })

  for (let i = 0; i <= 3; i++) {
    try {
      arc.setAccount(accounts[i].address)
      await proposal.vote(IProposalOutcome.Pass).send()
    } catch (err) {
      // TODO: this sometimes fails with uninformative `revert`, cannot find out why
      if (err.message.match(/already executed/)) {
        return
      } else {
        // ignore?
        throw err
      }
    } finally {
      arc.setAccount(accounts[0].address)
    }
  }
  return
}

// export async function timeTravel(seconds: number, web3: any) {
//   const jsonrpc = '2.0'
//   // web3 = new Web3('http://localhost:8545')
//   // web3.providers.HttpProvider.prototype.sendAsync = web3.providers.HttpProvider.prototype.send
//   return new Promise((resolve, reject) => {
//     web3.currentProvider.send({
//       id: new Date().getTime(),
//       jsonrpc,
//       method: 'evm_increaseTime',
//       // method: 'evm_mine',
//       params: [seconds]
//     }, (err1: Error) => {
//       if (err1) { return reject(err1) }
//       // resolve(res)

//       web3.currentProvider.send({
//         id: new Date().getTime(),
//         jsonrpc,
//         method: 'evm_mine'
//       }, (err2: Error, res: any) => {
//         return err2 ? reject(err2) : resolve(res)
//       })
//     })
//   })
// }

const web3 = new Web3('http://127.0.0.1:8545')

export const advanceTime = (time: number) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [time],
      id: new Date().getTime()
    }, (err: Error, result: any) => {
      if (err) { return reject(err) }
      return resolve(result)
    })
  })
}

export const advanceBlock = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: new Date().getTime()
    }, (err: Error, result: any) => {
      if (err) { return reject(err) }
      const newBlockHash = web3.eth.getBlock('latest').hash

      return resolve(newBlockHash)
    })
  })
}

export const takeSnapshot = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_snapshot',
      id: new Date().getTime()
    }, (err: Error, snapshotId: string) => {
      if (err) { return reject(err) }
      return resolve(snapshotId)
    })
  })
}

export const revertToSnapShot = (id: string) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      id: new Date().getTime(),
      jsonrpc: '2.0',
      method: 'evm_revert',
      params: [id]
    }, (err: Error, result: any) => {
      if (err) { return reject(err) }
      return resolve(result)
    })
  })
}

export const advanceTimeAndBlock = async (time: number) => {
  await advanceTime(time)
  await advanceBlock()
  return Promise.resolve(web3.eth.getBlock('latest'))
}

export async function firstResult(observable: Observable<any>) {
  return observable.pipe(first()).toPromise()
}

export function getContractAddressesFromMigration(environment: 'private' | 'rinkeby' | 'mainnet'): IContractInfo[] {
  const migration = require('@daostack/migration/migration.json')[environment]
  const contracts: IContractInfo[] = []
  for (const version of Object.keys(migration.base)) {
    for (const name of Object.keys(migration.base[version])) {
      contracts.push({
        address: migration.base[version][name].toLowerCase(),
        id: migration.base[version][name],
        alias: migration.base[version][name], // fake the data for tests
        name,
        version
      })
    }

  }
  return contracts
}
