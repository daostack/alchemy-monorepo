const utils = require('./utils.js')
async function migrateDAO ({ web3, spinner, confirm, opts, migrationParams, logTx, previousMigration: { base } }) {
  opts.gas = 6721975
  if (!(await confirm('About to migrate new DAO. Continue?'))) {
    return
  }

  if (!base) {
    const msg = `Couldn't find existing base migration ('migration.json' > 'base').`
    spinner.fail(msg)
    throw new Error(msg)
  }

  spinner.start('Migrating DAO...')
  let contributionRewardParams, genericSchemeParams, schemeRegistrarParams, globalConstraintRegistrarParams, upgradeSchemeParams
  let tx

  const {
    UController,
    SchemeRegistrar,
    ContributionReward,
    GenericScheme,
    GenesisProtocol,
    GlobalConstraintRegistrar,
    UpgradeScheme
  } = base

  const uController = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/UController.json').abi,
    UController,
    opts
  )

  const schemeRegistrar = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/SchemeRegistrar.json').abi,
    SchemeRegistrar,
    opts
  )

  const contributionReward = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/ContributionReward.json').abi,
    ContributionReward,
    opts
  )

  const genericScheme = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/GenericScheme.json').abi,
    GenericScheme,
    opts
  )

  const globalConstraintRegistrar = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/GlobalConstraintRegistrar.json').abi,
    GlobalConstraintRegistrar,
    opts
  )

  const upgradeScheme = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/UpgradeScheme.json').abi,
    UpgradeScheme,
    opts
  )

  const genesisProtocol = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/GenesisProtocol.json').abi,
    GenesisProtocol,
    opts
  )

  const randomName = utils.generateRnadomName()

  const [orgName, tokenName, tokenSymbol, founders] = [
    migrationParams.orgName != null ? migrationParams.orgName : randomName,
    migrationParams.tokenName != null ? migrationParams.tokenName : randomName + ' Token',
    migrationParams.tokenSymbol != null ? migrationParams.tokenSymbol : randomName[0] + randomName.split(' ')[1][0] + 'T',
    migrationParams.founders
  ]

  spinner.start('Creating a new organization...')

  spinner.start('Deploying DAO Token')
  const daoToken = (await new web3.eth.Contract(
    require('@daostack/arc/build/contracts/DAOToken.json').abi,
    undefined,
    opts
  ).deploy({
    data: require('@daostack/arc/build/contracts/DAOToken.json').bytecode,
    arguments: [tokenName, tokenSymbol, 0]
  }).send())

  spinner.start('Deploying Reputation')
  const reputation = (await new web3.eth.Contract(
    require('@daostack/arc/build/contracts/Reputation.json').abi,
    undefined,
    opts
  ).deploy({
    data: require('@daostack/arc/build/contracts/Reputation.json').bytecode
  }).send())

  spinner.start('Deploying Avatar.')
  const avatar = (await new web3.eth.Contract(
    require('@daostack/arc/build/contracts/Avatar.json').abi,
    undefined,
    opts
  ).deploy({
    data: require('@daostack/arc/build/contracts/Avatar.json').bytecode,
    arguments: [orgName, daoToken.options.address, reputation.options.address]
  }).send())

  spinner.start('Minting founders tokens and reputation')
  for (let i in founders) {
    let founder = founders[i]

    if (founder.reputation > 0) {
      tx = await daoToken.methods.mint(founder.address, founder.reputation).send()
      await logTx(tx, `Minted ${founder.reputation} reputation to ${founder.address}`)
    }
    if (founder.tokens > 0) {
      tx = await daoToken.methods.mint(founder.address, founder.tokens).send()
      await logTx(tx, `Minted ${founder.tokens} tokens to ${founder.address}`)
    }
  }

  let Controller, controller

  if (migrationParams.useUController) {
    Controller = UController
    controller = uController
  } else {
    spinner.start('Deploying Controller')
    controller = (await new web3.eth.Contract(
      require('@daostack/arc/build/contracts/Controller.json').abi,
      undefined,
      opts
    ).deploy({
      data: require('@daostack/arc/build/contracts/Controller.json').bytecode,
      arguments: [avatar.options.address]
    }).send())
    Controller = controller.options.address
  }

  spinner.start('Transfer Avatar to Controller ownership')
  tx = await avatar.methods.transferOwnership(Controller).send()
  await logTx(tx, 'Finished transferring Avatar to Controller ownership')

  spinner.start('Transfer Reputation to Controller ownership')
  tx = await reputation.methods.transferOwnership(Controller).send()
  await logTx(tx, 'Finished transferring Reputation to Controller ownership')

  spinner.start('Transfer DAOToken to Controller ownership')
  tx = await daoToken.methods.transferOwnership(Controller).send()
  await logTx(tx, 'Finished transferring DAOToken to Controller ownership')

  if (migrationParams.useUController) {
    spinner.start('Register Avatar to UController')
    tx = await controller.methods.newOrganization(avatar.options.address).send()
    await logTx(tx, 'Finished registerring Avatar')
  }

  spinner.start('Setting GenesisProtocol parameters...')
  const genesisProtocolSetParams = genesisProtocol.methods.setParameters(
    [
      migrationParams.GenesisProtocol.queuedVoteRequiredPercentage,
      migrationParams.GenesisProtocol.queuedVotePeriodLimit,
      migrationParams.GenesisProtocol.boostedVotePeriodLimit,
      migrationParams.GenesisProtocol.preBoostedVotePeriodLimit,
      migrationParams.GenesisProtocol.thresholdConst,
      migrationParams.GenesisProtocol.quietEndingPeriod,
      web3.utils.toWei(migrationParams.GenesisProtocol.proposingRepRewardGwei.toString(), 'gwei'),
      migrationParams.GenesisProtocol.votersReputationLossRatio,
      web3.utils.toWei(migrationParams.GenesisProtocol.minimumDaoBountyGWei.toString(), 'gwei'),
      migrationParams.GenesisProtocol.daoBountyConst,
      migrationParams.GenesisProtocol.activationTime
    ],
    migrationParams.GenesisProtocol.voteOnBehalf
  )

  const genesisProtocolParams = await genesisProtocolSetParams.call()
  tx = await genesisProtocolSetParams.send()
  await logTx(tx, 'GenesisProtocol parameters set.')

  if (migrationParams.schemes.RegisterScheme) {
    spinner.start('Setting Scheme Registrar parameters...')
    const schemeRegistrarSetParams = schemeRegistrar.methods.setParameters(
      migrationParams.SchemeRegistrar.voteRegisterParams == null ? genesisProtocolParams : migrationParams.SchemeRegistrar.voteRegisterParams,
      migrationParams.SchemeRegistrar.voteRemoveParams == null ? genesisProtocolParams : migrationParams.SchemeRegistrar.voteRemoveParams,
      migrationParams.SchemeRegistrar.votingMachine == null ? GenesisProtocol : migrationParams.SchemeRegistrar.votingMachine
    )
    schemeRegistrarParams = await schemeRegistrarSetParams.call()
    tx = await schemeRegistrarSetParams.send()
    await logTx(tx, 'Scheme Registrar parameters set.')
    tx = await controller.methods.registerScheme(SchemeRegistrar, schemeRegistrarParams, '0x0000001F', avatar.options.address).send()
    await logTx(tx, 'Scheme Registrar successfully added to DAO.')
  }

  if (migrationParams.schemes.ContributionReward) {
    spinner.start('Setting Contribution Reward parameters...')
    const contributionRewardSetParams = contributionReward.methods.setParameters(
      migrationParams.ContributionReward.voteParams == null ? genesisProtocolParams : migrationParams.ContributionReward.voteParams,
      migrationParams.ContributionReward.votingMachine == null ? GenesisProtocol : migrationParams.ContributionReward.votingMachine
    )
    contributionRewardParams = await contributionRewardSetParams.call()
    tx = await contributionRewardSetParams.send()
    await logTx(tx, 'Contribution Reward parameters set.')
    tx = await controller.methods.registerScheme(ContributionReward, contributionRewardParams, '0x00000000', avatar.options.address).send()
    await logTx(tx, 'Contribution Reward successfully added to DAO.')
  }

  if (migrationParams.schemes.GenericScheme) {
    spinner.start('Setting Generic Scheme parameters...')
    const genericSchemeSetParams = genericScheme.methods.setParameters(
      genesisProtocolParams,
      GenesisProtocol,
      migrationParams.genericScheme.targetContract
    )
    genericSchemeParams = await genericSchemeSetParams.call()
    tx = await genericSchemeSetParams.send()
    await logTx(tx, 'Generic Scheme parameters set.')
    tx = await controller.methods.registerScheme(GenericScheme, genericSchemeParams, '0x00000010', avatar.options.address).send()
    await logTx(tx, 'Generic Scheme successfully added to DAO.')
  }

  if (migrationParams.schemes.GlobalConstraintRegistrar) {
    spinner.start('Setting Global Constraint Registrar parameters...')
    const globalConstraintRegistrarSetParams = globalConstraintRegistrar.methods.setParameters(
      migrationParams.GlobalConstraintRegistrar.voteParams == null ? genesisProtocolParams : migrationParams.GlobalConstraintRegistrar.voteParams,
      migrationParams.GlobalConstraintRegistrar.votingMachine == null ? GenesisProtocol : migrationParams.GlobalConstraintRegistrar.votingMachine
    )
    globalConstraintRegistrarParams = await globalConstraintRegistrarSetParams.call()
    tx = await globalConstraintRegistrarSetParams.send()
    await logTx(tx, 'Global Constraints Registrar parameters set.')
    tx = await controller.methods.registerScheme(GlobalConstraintRegistrar, globalConstraintRegistrarParams, '0x00000004', avatar.options.address).send()
    await logTx(tx, 'Global Constraints Registrar successfully added to DAO.')
  }

  if (migrationParams.schemes.UpgradeScheme) {
    spinner.start('Setting Upgrade Scheme parameters...')
    const upgradeSchemeSetParams = upgradeScheme.methods.setParameters(
      migrationParams.UpgradeScheme.voteParams == null ? genesisProtocolParams : migrationParams.UpgradeScheme.voteParams,
      migrationParams.UpgradeScheme.votingMachine == null ? GenesisProtocol : migrationParams.UpgradeScheme.votingMachine
    )
    upgradeSchemeParams = await upgradeSchemeSetParams.call()
    tx = await upgradeSchemeSetParams.send()
    await logTx(tx, 'Upgrade Scheme parameters set.')
    tx = await controller.methods.registerScheme(UpgradeScheme, upgradeSchemeParams, '0x0000000A', avatar.options.address).send()
    await logTx(tx, 'Upgrade Scheme successfully added to DAO.')
  }

  if (migrationParams.unregisterOwner || migrationParams.unregisterOwner === undefined) {
    tx = await controller.methods.unregisterScheme(web3.eth.defaultAccount, avatar.options.address).send()
    await logTx(tx, 'Revoked deployer access.')
  }

  console.log(
    {
      name: orgName,
      Avatar: avatar.options.address,
      DAOToken: daoToken.options.address,
      Reputation: reputation.options.address,
      Controller
    }
  )
  return {
    dao: {
      name: orgName,
      Avatar: avatar.options.address,
      DAOToken: daoToken.options.address,
      Reputation: reputation.options.address,
      Controller
    }
  }
}

module.exports = migrateDAO
