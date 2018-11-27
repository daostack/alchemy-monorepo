import Arc from '../src/index'
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
