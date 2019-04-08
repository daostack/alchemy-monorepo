const utils = require('./utils.js')
async function migrateDAO ({ web3, spinner, confirm, opts, migrationParams, logTx, previousMigration: { base } }) {
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
    DaoCreator,
    SchemeRegistrar,
    ContributionReward,
    GenericScheme,
    GenesisProtocol,
    GlobalConstraintRegistrar,
    UpgradeScheme
  } = base

  const daoCreator = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/DaoCreator.json').abi,
    DaoCreator,
    opts
  )

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
    migrationParams.orgName !== undefined ? migrationParams.orgName : randomName,
    migrationParams.tokenName !== undefined ? migrationParams.tokenName : randomName + ' Token',
    migrationParams.tokenSymbol !== undefined ? migrationParams.tokenSymbol : randomName[0] + randomName.split(' ')[1][0] + 'T',
    migrationParams.founders
  ]

  let avatar, daoToken, reputation, Controller, controller

  if (migrationParams.useDaoCreator === true) {
    spinner.start('Creating a new organization...')

    const [founderAddresses, tokenDist, repDist] = [
      founders.map(({ address }) => address),
      founders.map(({ tokens }) => web3.utils.toWei(tokens !== undefined ? tokens.toString() : '0')),
      founders.map(({ reputation }) => web3.utils.toWei(reputation !== undefined ? reputation.toString() : '0'))
    ]

    const foundersBatchSize = 20

    let foundersInitCount = founderAddresses.length < foundersBatchSize ? founderAddresses.length : foundersBatchSize
    const forgeOrg = daoCreator.methods.forgeOrg(
      orgName,
      tokenName,
      tokenSymbol,
      founderAddresses.slice(0, foundersInitCount),
      tokenDist.slice(0, foundersInitCount),
      repDist.slice(0, foundersInitCount),
      migrationParams.useUController === true ? UController : '0x0000000000000000000000000000000000000000',
      '0'
    )

    tx = await forgeOrg.send()

    const Avatar = tx.events.NewOrg.returnValues._avatar

    await logTx(tx, 'Created new organization.')

    let foundersToAddCount = founderAddresses.length - foundersBatchSize
    let i = 0
    while (foundersToAddCount > 0) {
      i++
      spinner.start('Adding founders...')
      let currentBatchCount = foundersToAddCount < foundersBatchSize ? foundersToAddCount : foundersBatchSize
      tx = await daoCreator.methods.addFounders(
        Avatar,
        founderAddresses.slice(i * foundersBatchSize, i * foundersBatchSize + currentBatchCount),
        tokenDist.slice(i * foundersBatchSize, i * foundersBatchSize + currentBatchCount),
        repDist.slice(i * foundersBatchSize, i * foundersBatchSize + currentBatchCount)
      ).send()
      await logTx(tx, 'Finished adding founders.')
      foundersToAddCount -= foundersBatchSize
    }

    avatar = new web3.eth.Contract(
      require('@daostack/arc/build/contracts/Avatar.json').abi,
      Avatar,
      opts
    )

    daoToken = new web3.eth.Contract(
      require('@daostack/arc/build/contracts/DAOToken.json').abi,
      await avatar.methods.nativeToken().call(),
      opts
    )

    reputation = new web3.eth.Contract(
      require('@daostack/arc/build/contracts/Reputation.json').abi,
      await avatar.methods.nativeReputation().call(),
      opts
    )
    if (migrationParams.useUController) {
      Controller = UController
      controller = uController
    } else {
      spinner.start('Deploying Controller')
      controller = new web3.eth.Contract(
        require('@daostack/arc/build/contracts/Controller.json').abi,
        await avatar.methods.owner().call(),
        opts
      )
      Controller = controller.options.address
    }
  } else {
    spinner.start('Deploying DAO Token')
    daoToken = (await new web3.eth.Contract(
      require('@daostack/arc/build/contracts/DAOToken.json').abi,
      undefined,
      opts
    ).deploy({
      data: require('@daostack/arc/build/contracts/DAOToken.json').bytecode,
      arguments: [tokenName, tokenSymbol, 0]
    }).send())

    spinner.start('Deploying Reputation')
    reputation = (await new web3.eth.Contract(
      require('@daostack/arc/build/contracts/Reputation.json').abi,
      undefined,
      opts
    ).deploy({
      data: require('@daostack/arc/build/contracts/Reputation.json').bytecode
    }).send())

    spinner.start('Deploying Avatar.')
    avatar = (await new web3.eth.Contract(
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
        tx = await reputation.methods.mint(founder.address, web3.utils.toWei(`${founder.reputation}`)).send()
        await logTx(tx, `Minted ${founder.reputation} reputation to ${founder.address}`)
      }
      if (founder.tokens > 0) {
        tx = await daoToken.methods.mint(founder.address, web3.utils.toWei(`${founder.tokens}`)).send()
        await logTx(tx, `Minted ${founder.tokens} tokens to ${founder.address}`)
      }
    }

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
  }

  let schemeNames = []
  let schemes = []
  let params = []
  let permissions = []

  spinner.start('Setting GenesisProtocol parameters...')

  let votingMachinesParams = []

  for (let i in migrationParams.VotingMachinesParams) {
    if (migrationParams.VotingMachinesParams[i].votingParamsHash !== undefined) {
      votingMachinesParams.push(migrationParams.VotingMachinesParams[i].votingParamsHash)
      continue
    }
    const genesisProtocolSetParams = genesisProtocol.methods.setParameters(
      [
        migrationParams.VotingMachinesParams[i].queuedVoteRequiredPercentage,
        migrationParams.VotingMachinesParams[i].queuedVotePeriodLimit,
        migrationParams.VotingMachinesParams[i].boostedVotePeriodLimit,
        migrationParams.VotingMachinesParams[i].preBoostedVotePeriodLimit,
        migrationParams.VotingMachinesParams[i].thresholdConst,
        migrationParams.VotingMachinesParams[i].quietEndingPeriod,
        web3.utils.toWei(migrationParams.VotingMachinesParams[i].proposingRepRewardGwei.toString(), 'gwei'),
        migrationParams.VotingMachinesParams[i].votersReputationLossRatio,
        web3.utils.toWei(migrationParams.VotingMachinesParams[i].minimumDaoBountyGWei.toString(), 'gwei'),
        migrationParams.VotingMachinesParams[i].daoBountyConst,
        migrationParams.VotingMachinesParams[i].activationTime
      ],
      migrationParams.VotingMachinesParams[i].voteOnBehalf
    )

    votingMachinesParams.push(await genesisProtocolSetParams.call())
    tx = await genesisProtocolSetParams.send()
    await logTx(tx, 'GenesisProtocol parameters set.')
  }

  if (migrationParams.schemes.SchemeRegistrar) {
    spinner.start('Setting Scheme Registrar parameters...')
    const schemeRegistrarSetParams = schemeRegistrar.methods.setParameters(
      migrationParams.SchemeRegistrar.voteRegisterParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.SchemeRegistrar.voteRegisterParams],
      migrationParams.SchemeRegistrar.voteRemoveParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.SchemeRegistrar.voteRemoveParams],
      migrationParams.SchemeRegistrar.votingMachine === undefined ? GenesisProtocol : migrationParams.SchemeRegistrar.votingMachine
    )
    schemeRegistrarParams = await schemeRegistrarSetParams.call()
    tx = await schemeRegistrarSetParams.send()
    await logTx(tx, 'Scheme Registrar parameters set.')
    schemeNames.push('Scheme Registrar')
    schemes.push(SchemeRegistrar)
    params.push(schemeRegistrarParams)
    permissions.push('0x0000001F')
  }

  if (migrationParams.schemes.ContributionReward) {
    spinner.start('Setting Contribution Reward parameters...')
    const contributionRewardSetParams = contributionReward.methods.setParameters(
      migrationParams.ContributionReward.voteParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.ContributionReward.voteParams],
      migrationParams.ContributionReward.votingMachine === undefined ? GenesisProtocol : migrationParams.ContributionReward.votingMachine
    )
    contributionRewardParams = await contributionRewardSetParams.call()
    tx = await contributionRewardSetParams.send()
    await logTx(tx, 'Contribution Reward parameters set.')
    schemeNames.push('Contribution Reward')
    schemes.push(ContributionReward)
    params.push(contributionRewardParams)
    permissions.push('0x00000000')
  }

  if (migrationParams.schemes.GenericScheme) {
    spinner.start('Setting Generic Scheme parameters...')
    const genericSchemeSetParams = genericScheme.methods.setParameters(
      migrationParams.GenericScheme.voteParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.GenericScheme.voteParams],
      migrationParams.GenericScheme.votingMachine === undefined ? GenesisProtocol : migrationParams.GenericScheme.votingMachine,
      migrationParams.genericScheme.targetContract
    )
    genericSchemeParams = await genericSchemeSetParams.call()
    tx = await genericSchemeSetParams.send()
    await logTx(tx, 'Generic Scheme parameters set.')
    schemeNames.push('Generic Scheme')
    schemes.push(GenericScheme)
    params.push(genericSchemeParams)
    permissions.push('0x00000010')
  }

  if (migrationParams.schemes.GlobalConstraintRegistrar) {
    spinner.start('Setting Global Constraint Registrar parameters...')
    const globalConstraintRegistrarSetParams = globalConstraintRegistrar.methods.setParameters(
      migrationParams.GlobalConstraintRegistrar.voteParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.GlobalConstraintRegistrar.voteParams],
      migrationParams.GlobalConstraintRegistrar.votingMachine === undefined ? GenesisProtocol : migrationParams.GlobalConstraintRegistrar.votingMachine
    )
    globalConstraintRegistrarParams = await globalConstraintRegistrarSetParams.call()
    tx = await globalConstraintRegistrarSetParams.send()
    await logTx(tx, 'Global Constraints Registrar parameters set.')
    schemeNames.push('Global Constraints Registrar')
    schemes.push(GlobalConstraintRegistrar)
    params.push(globalConstraintRegistrarParams)
    permissions.push('0x00000004')
  }

  if (migrationParams.schemes.UpgradeScheme) {
    spinner.start('Setting Upgrade Scheme parameters...')
    const upgradeSchemeSetParams = upgradeScheme.methods.setParameters(
      migrationParams.UpgradeScheme.voteParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.UpgradeScheme.voteParams],
      migrationParams.UpgradeScheme.votingMachine === undefined ? GenesisProtocol : migrationParams.UpgradeScheme.votingMachine
    )
    upgradeSchemeParams = await upgradeSchemeSetParams.call()
    tx = await upgradeSchemeSetParams.send()
    await logTx(tx, 'Upgrade Scheme parameters set.')
    schemeNames.push('Upgrade Scheme')
    schemes.push(UpgradeScheme)
    params.push(upgradeSchemeParams)
    permissions.push('0x0000000A')
  }

  if (migrationParams.useDaoCreator === true) {
    spinner.start('Setting DAO schemes...')
    tx = await daoCreator.methods.setSchemes(avatar.options.address, schemes, params, permissions, 'metaData').send()
    await logTx(tx, 'DAO schemes set.')
  } else {
    for (let i in schemes) {
      spinner.start('Registering ' + schemeNames[i] + ' to the DAO...')
      tx = await controller.methods.registerScheme(schemes[i], params[i], permissions[i], avatar.options.address).send()
      await logTx(tx, schemeNames[i] + ' was successfully registered to the DAO.')
    }
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
