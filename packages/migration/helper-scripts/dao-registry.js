const utils = require('../utils.js')

async function updateDAORegistry ({ arcVersion, web3, opts, migrationParams, logTx, sendTx, optimizedAbis }) {
  let tx

  let contractsDir = 'contracts'
  if (optimizedAbis) {
    contractsDir = 'contracts-optimized'
  }

  let unregisterAvatarAddresses = migrationParams.unregisterAvatarAddresses
  let avatarAddresses = migrationParams.avatarAddresses

  let daoRegistry = new web3.eth.Contract(
    utils.importAbi(`./${contractsDir}/${arcVersion}/DAORegistry.json`).abi,
    migrationParams.daoRegistryAddress,
    opts
  )

  for (let avatarAddress of unregisterAvatarAddresses) {
    tx = (await sendTx(daoRegistry.methods.unRegister(avatarAddress), 'Unregistering DAO in DAORegistry')).receipt
    await logTx(tx, 'Finished Unregistering DAO in DAORegistry')
  }

  for (let avatarAddress of avatarAddresses) {
    let avatar = new web3.eth.Contract(
      utils.importAbi(`./${contractsDir}/${arcVersion}/Avatar.json`).abi,
      avatarAddress,
      opts
    )

    let DAOname = await avatar.methods.orgName().call()
    if (await daoRegistry.methods.isRegister(DAOname).call()) {
      tx = (await sendTx(daoRegistry.methods.unRegister(avatar.options.address), 'Unregistering DAO in DAORegistry')).receipt
      await logTx(tx, 'Finished Unregistering DAO in DAORegistry')
    }
    DAOname += ' ETHDenver DAO'
    tx = (await sendTx(daoRegistry.methods.register(avatar.options.address, DAOname), 'Registering DAO in DAORegistry')).receipt
    await logTx(tx, 'Finished Registering DAO in DAORegistry')
  }
}

module.exports = updateDAORegistry
