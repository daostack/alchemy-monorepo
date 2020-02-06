import { RetryLink } from 'apollo-link-retry'
import { Arc } from '../src'

jest.setTimeout(20000)
/**
 * Tests to see if the apollo retry link works as expected
 */
describe('client handles errors', () => {

  it('will retry on failed connection', async () => {
    // get all DAOs
    const graphqlHttpProvider = 'http://127.0.0.1:8000/name/doesnotexist'
    const graphqlWsProvider = 'http://127.0.0.1:8001/name/doesnotexist'

    let retries = 0
    const retryLink = new RetryLink({
      attempts: {
        max: 3, // max number of retry attempts
        retryIf: (error, _operation) => {
          retries += 1
          return !!error
        }
      },
      delay: {
        initial: 100,
        jitter: true,
        max: 300 // can be Infinity
      }
    })

    const arc = new Arc({
      graphqlHttpProvider,
      graphqlRetryLink: retryLink,
      graphqlWsProvider,
      ipfsProvider: '',
      web3Provider: 'ws://127.0.0.1:8545'
    })

    // the call to fetchContractInfos() will fail because the graphqlHttp endpoint is not reposding
    await expect(arc.fetchContractInfos()).rejects.toThrow()
    expect(retries).toEqual(2) // we set attempts.max to 3, so we have retried twice before throwing the error
  })
})
