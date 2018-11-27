import Arc from '../src/index'
import { getContractAddresses, getOptions, getWeb3 } from './from-subgraph/util'
export const graphqlHttpProvider: string = 'http://127.0.0.1:8000/by-name/daostack/graphql'
export const graphqlWSProvider: string = 'http://127.0.0.1:8001/by-name/daostack'
export const web3Provider: string = 'http://127.0.0.1:8545'

export function getArc() {
  return new Arc({
    graphqlHttpProvider,
    graphqlWSProvider,
    web3Provider
  })
}

// TODO: itnegration this in src.repution.ts
export async function mintSomeReputation() {
  const web3 = await getWeb3()
  const addresses = getContractAddresses()
  // console.log(addresses)
  const opts = await getOptions(web3)
  const accounts = web3.eth.accounts.wallet
  const Reputation = require('@daostack/arc/build/contracts/Reputation.json')
  const reputation = new web3.eth.Contract(Reputation.abi, addresses.Reputation, opts)
  await reputation.methods.mint(accounts[4].address, '99').send()
}
