// require('dotenv').config();

process.env = {
  ethereum: 'http://127.0.0.1:8545',
  node_http: 'http://127.0.0.1:8000/by-name/daostack/graphql',
  node_ws: 'http://127.0.0.1:8001/by-name/daostack',
  test_mnemonic: 'behave pipe turkey animal voyage dial relief menu blush match jeans general',
  ...process.env
}

const { execute } = require('apollo-link')
const { WebSocketLink } = require('apollo-link-ws')
const { SubscriptionClient } = require('subscriptions-transport-ws')
const ws = require('ws')
import axios from 'axios'
// import * as HDWallet from 'hdwallet-accounts';
const Web3 = require('web3')
// const test_mnemonic = 'behave pipe turkey animal voyage dial relief menu blush match jeans general'

const accounts = [
  '0xb0c908140fe6fd6fbd4990a5c2e35ca6dc12bfb2',
  '0x9c7f9f45a22ad3d667a5439f72b563df3aa70aae',
  '0xa2a064b3b22fc892dfb71923a6d844b953aa247c',
  '0xe7d97598a2272e3f9d8479b8fcb672db2907abcf',
  '0xdeeaa92e025ca7fe34679b0b92cd4ffa162c8de8',
  '0x81cfdaf70273745a291a7cf9af801a4cffa87a95',
  '0x8ec400484deb5330bcd0bc005c13a557c5247727',
  '0x78133bd8c359c0bf74a07917b0cde7dee7e2b1dc',
  '0xac5097104e6dabcd3a47aeff603ad32355218806',
  '0x62ed2dfcb6dca245e1a67cb097bec31d37caa015'
]
const pks = [
  '0x8d4408014d165ec69d8cc9f091d8f4578ac5564f376f21887e98a6d33a6e3549',
  '0x2215f0a41dd3bb93f03049514949aaafcf136e6965f4a066d6bf42cc9f75a106',
  '0x6695c8ef58fecfc7410bf8b80c17319eaaca8b9481cc9c682fd5da116f20ef05',
  '0xaafe32768d11a3628ce9f4abab1bf5dea4e951648e5b658b1fcb051d4aa401aa',
  '0xb9a8635b40a60ad5b78706d4ede244ddf934dc873262449b473076de0c1e2959',
  '0x55887c2c6107237ac3b50fb17d9ff7313cad67757e44d1be5eb7bbf9fc9ca2ea',
  '0xb16a587ad59c2b3a3f47679ed2df348d6828a3bb5c6bb3797a1d5a567ce823cb',
  '0x38e4d9f7834bff33d164faf37e19bfa738ffff597fec19b646a56d53d768a795',
  '0x21d61bb15dd5fce46ef99f7d48463386096817c9529f499073882d9938a6d178',
  '0xc20d11920fb5a28bdb8c0f2987ebfb75f44ae24c1f602ffa5346bee422088328'
]

const { node_ws, node_http, ethereum, test_mnemonic } = process.env

export async function sendQuery(q: string, maxDelay = 1000) {
  await new Promise((res, rej) => setTimeout(res, maxDelay))
  const nodeHttp: string = node_http || ''
  const {
    data: { data }
  } = await axios.post(nodeHttp, {
    query: q
  })

  return data
}

export const addressLength = 40
export const hashLength = 64
export const nullAddress = '0x' + padZeros('', 40)
export const nullParamsHash = '0x' + padZeros('', 64)

export async function getWeb3() {
  const web3 = new Web3(ethereum)
  // const hdwallet = HDWallet(10, test_mnemonic);
  Array(10)
    .fill(10)
    .map((_, i) => i)
    .forEach(i => {
      const pk = pks[i]
      const account = web3.eth.accounts.privateKeyToAccount(pk)
      web3.eth.accounts.wallet.add(account)
    })
  web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address
  return web3
}

export function getContractAddresses() {
  return require('../../node_modules/@daostack/subgraph/config.json').addresses
}

export async function getOptions(web3: any) {
  const block = await web3.eth.getBlock('latest')
  return {
    from: web3.eth.defaultAccount,
    gas: block.gasLimit - 100000
  }
}

export function padZeros(str: string, max = 36): string {
  str = str.toString()
  return str.length < max ? padZeros('0' + str, max) : str
}

export const createSubscriptionObservable = (query: string, variables = 0, wsurl = node_ws) => {
  const client = new SubscriptionClient(wsurl, { reconnect: true }, ws)
  const link = new WebSocketLink(client)
  return execute(link, { query, variables })
}
