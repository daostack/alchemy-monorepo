import { BN } from './utils'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { DAO } from '../src/dao'
import Arc from '../src/index'
import { IProposalOutcome, IProposalType, Proposal } from '../src/proposal'
import { Reputation } from '../src/reputation'
import { Address } from '../src/types'
import { getContractAddresses } from '../src/utils'
const Web3 = require('web3')

export const graphqlHttpProvider: string = 'http://127.0.0.1:8000/subgraphs/name/daostack'
export const graphqlHttpMetaProvider: string = 'http://127.0.0.1:8000/subgraphs'
export const graphqlWsProvider: string = 'http://127.0.0.1:8001/subgraphs/name/daostack'
export const web3Provider: string = 'ws://127.0.0.1:8545'
export const ipfsProvider: string = '/ip4/127.0.0.1/tcp/5001'

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

export interface IContractAddressesFromMigration {
  base: { [key: string]: Address }
  dao: { [key: string]: Address }
  organs: { [key: string]: Address }
  test: { [key: string]: Address }
}

export function getContractAddressesFromMigration(): IContractAddressesFromMigration {
  const path = '@daostack/migration/migration.json'
  const addresses = require(path)
  if (!addresses || addresses === {}) {
    throw Error(`No addresses found, does the file at ${path} exist?`)
  }
  return addresses.private
}

export async function getOptions(web3: any) {
  const block = await web3.eth.getBlock('latest')
  return {
    from: web3.eth.defaultAccount,
    gas: block.gasLimit - 100000
  }
}

export async function newArc() {
  const arc = new Arc({
    contractAddresses: await getContractAddresses(graphqlHttpMetaProvider, 'daostack'),
    graphqlHttpProvider,
    graphqlWsProvider,
    ipfsProvider,
    web3Provider
  })

  for (const pk of pks) {
    const account = arc.web3.eth.accounts.privateKeyToAccount(pk)
    arc.web3.eth.accounts.wallet.add(account)
  }
  arc.web3.eth.defaultAccount = arc.web3.eth.accounts.wallet[0].address
  return arc
}

export async function mintSomeReputation() {
  const arc = await newArc()
  const addresses = getContractAddressesFromMigration()
  const token = new Reputation(addresses.organs.DemoReputation, arc)
  const accounts = arc.web3.eth.accounts.wallet
  await token.mint(accounts[1].address, toWei('99')).send()
}

export function mineANewBlock() {
  return mintSomeReputation()
}

export async function waitUntilTrue(test: () => Promise<boolean> | boolean) {
  return new Promise((resolve) => {
    (async function waitForIt(): Promise<void> {
      if (await test()) { return resolve() }
      setTimeout(waitForIt, 30)
    })()
  })
}

export async function getTestDAO() {
  // we have two indexed daos with the same name, but one has 6 members, and that is the one
  // we are using for testing
  const arc = await newArc()
  const contractAddressesfromMigration = await getContractAddressesFromMigration()
  return arc.dao(contractAddressesfromMigration.test.Avatar)
}

export async function createAProposal(dao?: DAO, options: any = {}) {
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
    type: IProposalType.ContributionReward,
    ...options
  }

  const response = await dao.createProposal(options).send()
  return response.result as Proposal
}

// Vote and vote and vote for proposal until it is accepted
export async function voteToAcceptProposal(proposal: Proposal) {
  const arc = proposal.context
  const accounts = arc.web3.eth.accounts.wallet

  for (let i = 0; i <= 3; i ++) {
    try {
      arc.setAccount(accounts[i].address)
      await proposal.vote(IProposalOutcome.Pass).send()
    } catch (err) {
      // TODO: this sometimes fails with uninformative `revert`, cannot find out why
      if (err.message.match(/already executed/)) {
        return
      } else {
        // ignore?
        // throw err
      }
    } finally {
      arc.setAccount(accounts[0].address)
    }
  }
  return
}

export async function timeTravel(seconds: number, web3: any) {
  const jsonrpc = '2.0'
  const id = 1
  web3 = new Web3('http://localhost:8545')
  web3.providers.HttpProvider.prototype.sendAsync = web3.providers.HttpProvider.prototype.send
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      id,
      jsonrpc,
      method: 'evm_increaseTime',
      params: [seconds]
    }, (err1: Error) => {
      if (err1) { return reject(err1) }

      web3.currentProvider.sendAsync({
        id: id + 1,
        jsonrpc,
        method: 'evm_mine'
      }, (err2: Error, res: any) => {
        return err2 ? reject(err2) : resolve(res)
      })
    })
  })
}

export async function firstResult(observable: Observable<any>) {
  return observable.pipe(first()).toPromise()
}
