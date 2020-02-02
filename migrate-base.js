const utils = require('./utils')

async function migrateBase ({ arcVersion, web3, spinner, confirm, opts, logTx, previousMigration, getArcVersionNumber, optimizedAbis }) {
  if (!(await confirm('About to migrate base contracts. Continue?'))) {
    return
  }

  let contractsDir = 'contracts'
  if (optimizedAbis) {
    contractsDir = 'contracts-optimized'
  }

  const addresses = {}
  let network = await web3.eth.net.getNetworkType()
  if (network === 'private') {
    if (await web3.eth.net.getId() === 100) {
      network = 'xdai'
    } else if (await web3.eth.net.getId() === 77) {
      network = 'sokol'
    }
  }
  async function deploy ({ contractName, abi, bytecode, deployedBytecode }, deps, ...args) {
    deps = deps || []
    for (let existing in previousMigration.base) {
      existing = previousMigration.base[existing]
      const sameDeps = deps.reduce((acc, dep) => addresses[dep] === existing[dep] && acc, true)

      const entryName = (contractName === 'DAOToken') ? contractName = 'GEN' : contractName

      const code = existing[entryName] && (await web3.eth.getCode(existing[contractName]))
      const sameCode = existing[entryName] && deployedBytecode === code

      if (
        entryName === 'GEN' &&
        existing[entryName] &&
        code !== '0x' &&
        (!(await confirm(`Found existing GEN (DAOToken) contract, Deploy new instance?`, false)) || network === 'private')
      ) {
        addresses[entryName] = existing[entryName]
        return existing[entryName]
      } else if (
        sameCode &&
        sameDeps &&
        !(await confirm(
          `Found existing '${entryName}' instance with same bytecode and ${
            !deps.length ? 'no ' : ''
          }dependencies on other contracts at '${existing[entryName]}'. Deploy new instance?`,
          false
        ))
      ) {
        addresses[entryName] = existing[entryName]
        return existing[entryName]
      }
    }
    spinner.start(`Migrating ${contractName}...`)
    const contract = new web3.eth.Contract(abi, undefined, opts)
    const deployContract = contract.deploy({
      data: bytecode,
      arguments: args
    }).send({
      from: web3.eth.defaultAccount
    })
    const tx = await new Promise(resolve => deployContract.on('receipt', resolve))
    const c = await deployContract
    await logTx(tx, `${c.options.address} => ${contractName}`)
    addresses[contractName === 'DAOToken' ? 'GEN' : contractName] = c.options.address
    return c.options.address
  }

  let GENToken = '0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf'

  let DAOTracker

  if (network === 'private') {
    GENToken = await deploy(
      utils.importAbi(`./${contractsDir}/${arcVersion}/DAOToken.json`),
      [],
      'DAOstack',
      'GEN',
      web3.utils.toWei('100000000')
    )

    const GENTokenContract = await new web3.eth.Contract(
      utils.importAbi(`./${contractsDir}/${arcVersion}/DAOToken.json`).abi,
      GENToken,
      opts
    )

    web3.eth.accounts.wallet.clear()

    let privateKeys = [
      '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
      '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1',
      '0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c',
      '0x646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913',
      '0xadd53f9a7e588d003326d1cbf9e4a43c061aadd9bc938c843a79e7b4fd2ad743',
      '0x395df67f0c2d2d9fe1ad08d1bc8b6627011959b79c53d7dd6a3536a33ab8a4fd',
      '0xe485d098507f54e7733a205420dfddbe58db035fa577fc294ebd14db90767a52',
      '0xa453611d9419d0e56f499079478fd72c37b251a94bfde4d19872c44cf65386e3',
      '0x829e924fdf021ba3dbbc4225edfece9aca04b929d6e75613329ca6f1d31c0bb4',
      '0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773'
    ]

    for (let i = 0; i < privateKeys.length; i++) {
      web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(privateKeys[i]))
      await GENTokenContract.methods.mint(web3.eth.accounts.wallet[i].address, web3.utils.toWei('1000')).send()
    }

    await deploy(
      utils.importAbi(`./${contractsDir}/${arcVersion}/DAORegistry.json`),
      [],
      web3.eth.accounts.wallet[0].address
    )
    if (getArcVersionNumber(arcVersion) >= 29) {
      DAOTracker = await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/DAOTracker.json`))
    }
  } else {
    addresses['GEN'] = GENToken
    if (network === 'main') {
      await deploy(
        utils.importAbi(`./${contractsDir}/${arcVersion}/DAORegistry.json`),
        [],
        '0x85e7fa550b534656d04d143b9a23a11e05077da3' // DAOstack's controlled account
      )
      if (getArcVersionNumber(arcVersion) >= 29) {
        DAOTracker = await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/DAOTracker.json`))
        const daoTracker = new web3.eth.Contract(
          utils.importAbi(`./${contractsDir}/${arcVersion}/DAOTracker.json`).abi,
          DAOTracker,
          opts
        )
        if (daoTracker.methods.owner().call() === web3.eth.accounts.wallet[0].address) {
          spinner.start('Transfering DAOTracker Ownership')
          let tx = await daoTracker.methods.transferOwnership('0x85e7fa550b534656d04d143b9a23a11e05077da3').send()
          await logTx(tx, 'Finished Transfering DAOTracker Ownership')
        }
      }
    } else {
      await deploy(
        utils.importAbi(`./${contractsDir}/${arcVersion}/DAORegistry.json`),
        [],
        '0x73Db6408abbea97C5DB8A2234C4027C315094936'
      )
      if (getArcVersionNumber(arcVersion) >= 29) {
        DAOTracker = await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/DAOTracker.json`))
        const daoTracker = new web3.eth.Contract(
          utils.importAbi(`./${contractsDir}/${arcVersion}/DAOTracker.json`).abi,
          DAOTracker,
          opts
        )
        if (daoTracker.methods.owner().call() === web3.eth.accounts.wallet[0].address) {
          spinner.start('Transfering DAOTracker Ownership')
          let tx = await daoTracker.methods.transferOwnership('0x73Db6408abbea97C5DB8A2234C4027C315094936').send()
          await logTx(tx, 'Finished Transfering DAOTracker Ownership')
        }
      }
    }
  }

  const ControllerCreator = await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/ControllerCreator.json`))

  if (getArcVersionNumber(arcVersion) >= 29) {
    await deploy(
      utils.importAbi(`./${contractsDir}/${arcVersion}/DaoCreator.json`),
      ['ControllerCreator', 'DAOTracker'],
      ControllerCreator,
      DAOTracker
    )
  } else {
    await deploy(
      utils.importAbi(`./${contractsDir}/${arcVersion}/DaoCreator.json`),
      ['ControllerCreator'],
      ControllerCreator
    )
  }
  if (getArcVersionNumber(arcVersion) < 34) {
    await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/UController.json`))
  }
  await deploy(
    utils.importAbi(`./${contractsDir}/${arcVersion}/GenesisProtocol.json`),
    ['DAOToken'],
    GENToken
  )
  await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/SchemeRegistrar.json`))
  await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/UpgradeScheme.json`))
  await deploy(
    utils.importAbi(`./${contractsDir}/${arcVersion}/GlobalConstraintRegistrar.json`)
  )
  await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/ContributionReward.json`))
  await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/AbsoluteVote.json`))
  await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/QuorumVote.json`))
  await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/TokenCapGC.json`))
  await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/VoteInOrganizationScheme.json`))
  await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/OrganizationRegister.json`))
  if (getArcVersionNumber(arcVersion) >= 22) {
    await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/Redeemer.json`))
  }
  if (getArcVersionNumber(arcVersion) >= 24) {
    if (getArcVersionNumber(arcVersion) < 34) {
      await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/UGenericScheme.json`))
    }
  } else {
    await deploy(utils.importAbi(`./${contractsDir}/${arcVersion}/GenericScheme.json`))
  }
  let migration = { 'base': previousMigration.base || {} }
  migration.base[arcVersion] = addresses
  return migration
}

module.exports = migrateBase
