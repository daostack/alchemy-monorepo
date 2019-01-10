import Arc from '../src/index'
export const graphqlHttpProvider: string = 'http://127.0.0.1:8000/subgraphs/name/daostack/graphql'
export const graphqlWsProvider: string = 'http://127.0.0.1:8001/subgraphs/name/daostack'
export const web3Provider: string = 'http://127.0.0.1:8545'
const Web3 = require('web3')

export const nullAddress: string  = '0x' + padZeros('', 40)

export function padZeros(str: string, max = 36): string {
  str = str.toString()
  return str.length < max ? padZeros('0' + str, max) : str
}

process.env = {
  ethereum: 'http://127.0.0.1:8545',
  node_http: 'http://127.0.0.1:8000/subgraphs/name/daostack/graphql',
  node_ws: 'http://127.0.0.1:8001/subgraphs/name/daostack',
  // test_mnemonic: "myth like bonus scare over problem client lizard pioneer submit female collect",
  ...process.env
}

const { node_ws, ethereum, test_mnemonic } = process.env

const pks = [
  '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
  '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1'
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

export function getContractAddresses() {
  const path = '@daostack/subgraph/migration.json'
  const addresses = { ...require(path).private.base, ...require(path).private.dao }
  if (!addresses || addresses === {}) {
    throw Error(`No addresses found, does the file at ${path} exist?`)
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

export function getArc() {
  const arc = new Arc({
    graphqlHttpProvider,
    graphqlWsProvider,
    web3Provider,
    contractAddresses: getContractAddresses()
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
  const reputation = new web3.eth.Contract(Reputation.abi, addresses.Reputation, opts)
  await reputation.methods.mint(accounts[1].address, '99').send()
}

export async function waitUntilTrue(f: () => boolean) {
  return new Promise((resolve, reject) => {
    (function waitForIt() {
        if (f()) { return resolve() }
        setTimeout(waitForIt, 30)
    })()
  })
}
