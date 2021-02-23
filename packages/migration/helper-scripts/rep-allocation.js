const utils = require('../utils.js')

async function allocateRep ({ arcVersion, web3, opts, migrationParams, logTx, sendTx, optimizedAbis }) {
  let tx

  let contractsDir = 'contracts'
  if (optimizedAbis) {
    contractsDir = 'contracts-optimized'
  }

  const repAllocation = new web3.eth.Contract(
    utils.importAbi(`./${contractsDir}/${arcVersion}/RepAllocation.json`).abi,
    migrationParams.repAllocationAddress,
    opts
  )

  const [addresses, repDist] = [
    migrationParams.accounts.map(({ address }) => address),
    migrationParams.accounts.map(({ reputation }) => web3.utils.toWei(reputation !== undefined ? reputation.toString() : '0'))
  ]

  let batchSize = migrationParams.batchSize === undefined ? 100 : migrationParams.batchSize

  let accountsToAddCount = addresses.length
  let counter = 0
  while (accountsToAddCount > 0) {
    let currentBatchCount = accountsToAddCount < batchSize ? accountsToAddCount : batchSize
    tx = (await sendTx(repAllocation.methods.addBeneficiaries(
      addresses.slice(
        counter * batchSize,
        counter * batchSize + currentBatchCount
      ),
      repDist.slice(
        counter * batchSize,
        counter * batchSize + currentBatchCount
      )
    ), 'Allocating Reputation...')).receipt
    await logTx(tx, 'Allocated Reputation Successfully.')

    accountsToAddCount -= batchSize
    counter++
  }
}

module.exports = allocateRep
