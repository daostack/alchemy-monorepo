async function migrateBase ({ web3, spinner, confirm, opts, logTx, previousMigration }) {
  if (!(await confirm('About to migrate base contracts. Continue?'))) {
    return
  }

  const addresses = {}
  async function deploy ({ contractName, abi, bytecode, deployedBytecode }, deps, ...args) {
    deps = deps || []
    const existing = previousMigration.base || {}
    const sameDeps = deps.reduce((acc, dep) => addresses[dep] === existing[dep] && acc, true)

    const entryName = (contractName === 'DAOToken') ? contractName = 'GEN' : contractName

    const code = existing[entryName] && (await web3.eth.getCode(existing[contractName]))
    const sameCode = existing[entryName] && deployedBytecode === code

    if (
      entryName === 'GEN' &&
      existing[entryName] &&
      code !== '0x' &&
      !(await confirm(`Found existing GEN (DAOToken) contract, Deploy new instance?`, false))
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
    addresses[contractName] = c.options.address
    return c.options.address
  }

  const network = await web3.eth.net.getNetworkType()
  let GENToken = '0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf'

  if (network === 'private') {
    GENToken = await deploy(
      require('@daostack/arc/build/contracts/DAOToken.json'),
      [],
      'DAOstack',
      'GEN',
      web3.utils.toWei('100000000')
    )

    const GENTokenContract = await new web3.eth.Contract(
      require('@daostack/arc/build/contracts/DAOToken.json').abi,
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
      require('@daostack/arc-hive/build/contracts/DAORegistry.json'),
      [],
      web3.eth.accounts.wallet[0].address
    )
  } else {
    addresses['GEN'] = GENToken
    if (network === 'main') {
      await deploy(
        require('@daostack/arc-hive/build/contracts/DAORegistry.json'),
        [],
        '0xd3BA32dd207Db75f535001FAC749c925423D8A6f' // DAOstack multisig
      )
    } else {
      await deploy(
        require('@daostack/arc-hive/build/contracts/DAORegistry.json'),
        [],
        '0x73Db6408abbea97C5DB8A2234C4027C315094936'
      )
    }
  }

  const ControllerCreator = await deploy(require('@daostack/arc/build/contracts/ControllerCreator.json'))

  await deploy(
    require('@daostack/arc/build/contracts/DaoCreator.json'),
    ['ControllerCreator'],
    ControllerCreator
  )
  await deploy(require('@daostack/arc/build/contracts/UController.json'))
  const GenesisProtocol = await deploy(
    require('@daostack/arc/build/contracts/GenesisProtocol.json'),
    ['DAOToken'],
    GENToken
  )
  await deploy(require('@daostack/arc/build/contracts/SchemeRegistrar.json'))
  await deploy(require('@daostack/arc/build/contracts/UpgradeScheme.json'))
  await deploy(
    require('@daostack/arc/build/contracts/GlobalConstraintRegistrar.json')
  )
  const ContributionReward = await deploy(require('@daostack/arc/build/contracts/ContributionReward.json'))
  await deploy(require('@daostack/arc/build/contracts/AbsoluteVote.json'))
  await deploy(require('@daostack/arc/build/contracts/QuorumVote.json'))
  await deploy(require('@daostack/arc/build/contracts/TokenCapGC.json'))
  await deploy(require('@daostack/arc/build/contracts/VestingScheme.json'))
  await deploy(require('@daostack/arc/build/contracts/VoteInOrganizationScheme.json'))
  await deploy(require('@daostack/arc/build/contracts/OrganizationRegister.json'))
  await deploy(
    require('@daostack/arc/build/contracts/Redeemer.json'),
    ['ContributionReward', 'GenesisProtocol'],
    ContributionReward,
    GenesisProtocol
  )

  await deploy(require('@daostack/arc/build/contracts/GenericScheme.json'))

  return {
    base: addresses
  }
}

module.exports = migrateBase
