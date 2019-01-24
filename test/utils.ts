import { ApolloQueryResult } from 'apollo-client'
import gql from 'graphql-tag'
import { take } from 'rxjs/operators'
import { IContractAddresses } from '../src/arc'
import { DAO } from '../src/dao'
import Arc from '../src/index'
import { Proposal } from '../src/proposal'
import { Address } from '../src/types'

export const graphqlHttpProvider: string = 'http://127.0.0.1:8000/subgraphs/name/daostack'
export const graphqlWsProvider: string = 'http://127.0.0.1:8001/subgraphs/name/daostack'
export const web3HttpProvider: string = 'http://127.0.0.1:8545'
export const web3WsProvider: string = 'ws://127.0.0.1:8545'

const Web3 = require('web3')

export const nullAddress: string  = '0x' + padZeros('', 40)

export function padZeros(str: string, max = 36): string {
  str = str.toString()
  return str.length < max ? padZeros('0' + str, max) : str
}

process.env = {
  ethereum: 'http://127.0.0.1:8545',
  node_http: 'http://127.0.0.1:8000/subgraphs/name/daostack',
  node_ws: 'http://127.0.0.1:8001/subgraphs/name/daostack',
  // test_mnemonic: "myth like bonus scare over problem client lizard pioneer submit female collect",
  ...process.env
}

const { ethereum } = process.env

const pks = [
  '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
  '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1',
  '0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c',
  '0x646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913'
]

export async function getWeb3() {
  const web3 = new Web3(ethereum)
  for (const pk of pks) {
    const account = web3.eth.accounts.privateKeyToAccount(pk)
    web3.eth.accounts.wallet.add(account)
  }
  web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address
  return web3
}

export function getContractAddresses(): IContractAddresses {
  const path = '@daostack/subgraph/migration.json'
  const addresses = require(path)
  // const addresses = { base: require(path).private.base, dao: require(path).private.dao }
  if (!addresses || addresses === {}) {
    throw Error(`No addresses found, does the file at ${path} exist?`)
  }
  return { base: addresses.private.base, dao: addresses.private.dao }
}

export async function getOptions(web3: any) {
  const block = await web3.eth.getBlock('latest')
  return {
    from: web3.eth.defaultAccount,
    gas: block.gasLimit - 100000
  }
}

export function getArc() {
  const arc = new Arc({
    contractAddresses: getContractAddresses(),
    graphqlHttpProvider,
    graphqlWsProvider,
    web3HttpProvider,
    web3WsProvider
  })

  for (const pk of pks) {
    const account = arc.web3.eth.accounts.privateKeyToAccount(pk)
    arc.web3.eth.accounts.wallet.add(account)
  }
  arc.web3.eth.defaultAccount = arc.web3.eth.accounts.wallet[0].address
  return arc
}

// TODO: itnegration this in src.repution.ts
export async function mintSomeReputation() {
  const web3 = await getWeb3()
  const addresses = getContractAddresses()
  const opts = await getOptions(web3)
  const accounts = web3.eth.accounts.wallet
  const Reputation = require('@daostack/arc/build/contracts/Reputation.json')
  const reputation = new web3.eth.Contract(Reputation.abi, addresses.base.Reputation, opts)
  await reputation.methods.mint(accounts[1].address, '99').send()
}

export function mineANewBlock() {
  return mintSomeReputation()
}

export async function waitUntilTrue(test: () => Promise<boolean> | boolean) {
  return new Promise((resolve) => {
    (async function waitForIt(): Promise<void> {
    //     cntr += 1
    //     if (cntr > 1000) { throw new Error((`Waited but got nothing :-()`))}
      if (await test()) { return resolve() }
      setTimeout(waitForIt, 30)
    })()
  })
}

export async function getContractAddressesFromSubgraph(): Promise<{ daos: any }> {
  const arc = getArc()
  const query = gql`
        {
              daos { id
              nativeReputation {
                id
              }
              nativeToken {
                id
              }
          }
      }
    `
  const response = await arc.apolloClient.query({query}) as ApolloQueryResult<{ daos: any[]}>
  const daos = response.data.daos
  return { daos: daos.map((dao: any) => {
    return {
      address: dao.id,
      nativeReputation: dao.nativeReputation.id,
      nativeToken: dao.nativeToken.id,
      membersCount: dao.membersCount
    }
  })
}
}

export async function getTestDAO() {
  const addresses = await getContractAddressesFromSubgraph()
  // we have two indexed daos with the same name, but one has 6 members, and that is the one
  // we are using for testing
  let address: Address
  if (addresses.daos[0].membersCount === 6) {
    address = addresses.daos[0].address
  } else {
    address = addresses.daos[1].address

  }
  const arc = await getArc()
  return arc.dao(address)
}

export async function createAProposal(dao: DAO) {
  const options = {
    beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
    ethReward: 300,
    externalTokenAddress: undefined,
    externalTokenReward: 0,
    nativeTokenReward: 1,
    periodLength: 12,
    periods: 5,
    type: 'ConributionReward'
  }

  // collect the first 4 results of the observable in a a listOfUpdates array
  const response = await dao.createProposal(options).pipe(take(2)).toPromise()
  return response.result as Proposal

}
