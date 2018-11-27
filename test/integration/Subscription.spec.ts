import { createSubscriptionObservable, getContractAddresses, getOptions, getWeb3 } from './util'

const Reputation = require('@daostack/arc/build/contracts/Reputation.json')
const gql = require('graphql-tag')

describe('Subscriptions', () => {
  jest.setTimeout(10000)
  let web3: any
  let addresses: any
  let opts: any
  let reputation: any
  it('Reputation Mint', async () => {
    const SUBSCRIBE_QUERY = gql`
      subscription {
        reputationMints {
          contract
          amount
          address
        }
      }
    `
    web3 = await getWeb3()
    addresses = getContractAddresses()
    // console.log(addresses)
    opts = await getOptions(web3)
    const accounts = web3.eth.accounts.wallet
    reputation = new web3.eth.Contract(Reputation.abi, addresses.Reputation, opts)
    const subscriptionClient = await createSubscriptionObservable(
      SUBSCRIBE_QUERY // Subscription query
      // {address: accounts[0].address.toLowerCase()} // Query variables
    )

    let event

    const consumer = await subscriptionClient.subscribe(
      (eventData: any) => {
        // Do something on receipt of the event
        event = eventData.data.reputationMints
      },
      (err: any) => {
        expect(true).toEqual(false)
      }
    )

    await reputation.methods.mint(accounts[4].address, '99').send()

    // wait a second
    // console.log('waiting 5 secs..')
    await new Promise(res => setTimeout(res, 2000))
    // console.log('done waitin\'')

    expect(event).toContainEqual({
      address: accounts[4].address.toLowerCase(),
      amount: '99',
      contract: reputation.options.address.toLowerCase()
    })

    consumer.unsubscribe()
  })
})
