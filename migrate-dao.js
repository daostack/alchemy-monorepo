const utils = require('./utils.js')
const sanitize = require('./sanitize')

async function migrateDAO ({ arcVersion, web3, spinner, confirm, opts, migrationParams, logTx, previousMigration, customAbisLocation, restart, getState, setState, cleanState }) {
  if (restart) {
    cleanState()
  }
  let deploymentState = getState()

  // sanitize the parameters
  sanitize(migrationParams)

  let base = previousMigration.base
  if (!(await confirm('About to migrate new DAO. Continue?'))) {
    return
  }

  if (!base[arcVersion]) {
    const msg = `Couldn't find existing base migration ('migration.json' > 'base').`
    spinner.fail(msg)
    throw new Error(msg)
  }

  spinner.start('Migrating DAO...')
  let contributionRewardParams, genericSchemeParams, schemeRegistrarParams, globalConstraintRegistrarParams, upgradeSchemeParams
  let tx
  let nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount) - 1

  const {
    UController,
    DaoCreator,
    DAORegistry,
    DAOTracker,
    SchemeRegistrar,
    ContributionReward,
    UGenericScheme,
    GenericScheme,
    GenesisProtocol,
    GlobalConstraintRegistrar,
    UpgradeScheme
  } = base[arcVersion]

  const daoCreator = new web3.eth.Contract(
    require(`./contracts/${arcVersion}/DaoCreator.json`).abi,
    DaoCreator,
    opts
  )

  const uController = new web3.eth.Contract(
    require(`./contracts/${arcVersion}/UController.json`).abi,
    UController,
    opts
  )

  const schemeRegistrar = new web3.eth.Contract(
    require(`./contracts/${arcVersion}/SchemeRegistrar.json`).abi,
    SchemeRegistrar,
    opts
  )

  const contributionReward = new web3.eth.Contract(
    require(`./contracts/${arcVersion}/ContributionReward.json`).abi,
    ContributionReward,
    opts
  )

  const genericScheme = new web3.eth.Contract(
    Number(arcVersion.slice(-2)) >= 24 ? require(`./contracts/${arcVersion}/UGenericScheme.json`).abi : require(`./contracts/${arcVersion}/GenericScheme.json`).abi,
    Number(arcVersion.slice(-2)) >= 24 ? UGenericScheme : GenericScheme,
    opts
  )

  const globalConstraintRegistrar = new web3.eth.Contract(
    require(`./contracts/${arcVersion}/GlobalConstraintRegistrar.json`).abi,
    GlobalConstraintRegistrar,
    opts
  )

  const upgradeScheme = new web3.eth.Contract(
    require(`./contracts/${arcVersion}/UpgradeScheme.json`).abi,
    UpgradeScheme,
    opts
  )

  const genesisProtocol = new web3.eth.Contract(
    require(`./contracts/${arcVersion}/GenesisProtocol.json`).abi,
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

  let avatar
  let daoToken
  let reputation
  let controller

  if (deploymentState.Schemes === undefined) {
    deploymentState.Schemes = []
    deploymentState.StandAloneContracts = []
  }

  if (migrationParams.useDaoCreator === true) {
    spinner.start('Creating a new organization...')

    const [founderAddresses, tokenDist, repDist] = [
      founders.map(({ address }) => address),
      founders.map(({ tokens }) => web3.utils.toWei(tokens !== undefined ? tokens.toString() : '0')),
      founders.map(({ reputation }) => web3.utils.toWei(reputation !== undefined ? reputation.toString() : '0'))
    ]

    const initFoundersBatchSize = 20
    const foundersBatchSize = 100
    if (deploymentState.Avatar === undefined) {
      let foundersInitCount = founderAddresses.length < initFoundersBatchSize ? founderAddresses.length : initFoundersBatchSize
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

      tx = await forgeOrg.send({ nonce: ++nonce })

      await logTx(tx, 'Created new organization.')
    }

    if (deploymentState.Avatar === undefined) {
      deploymentState.Avatar = tx.events.NewOrg.returnValues._avatar
      setState(deploymentState)
    }

    deploymentState.foundersToAddCount = deploymentState.foundersToAddCount === undefined ? founderAddresses.length - initFoundersBatchSize : deploymentState.foundersToAddCount
    deploymentState.foundersAdditionCounter = deploymentState.foundersAdditionCounter === undefined ? 0 : deploymentState.foundersAdditionCounter
    while (deploymentState.foundersToAddCount > 0) {
      spinner.start('Adding founders...')
      let currentBatchCount = deploymentState.foundersToAddCount < foundersBatchSize ? deploymentState.foundersToAddCount : foundersBatchSize
      tx = await daoCreator.methods.addFounders(
        deploymentState.Avatar,
        founderAddresses.slice(deploymentState.foundersAdditionCounter * foundersBatchSize + initFoundersBatchSize,
          deploymentState.foundersAdditionCounter * foundersBatchSize + currentBatchCount + initFoundersBatchSize),
        tokenDist.slice(deploymentState.foundersAdditionCounter * foundersBatchSize + initFoundersBatchSize,
          deploymentState.foundersAdditionCounter * foundersBatchSize + currentBatchCount + initFoundersBatchSize),
        repDist.slice(deploymentState.foundersAdditionCounter * foundersBatchSize + initFoundersBatchSize,
          deploymentState.foundersAdditionCounter * foundersBatchSize + currentBatchCount + initFoundersBatchSize)
      ).send({ nonce: ++nonce })
      await logTx(tx, 'Finished adding founders.')

      deploymentState.foundersToAddCount -= foundersBatchSize
      deploymentState.foundersAdditionCounter++
      setState(deploymentState)
    }

    avatar = new web3.eth.Contract(
      require(`./contracts/${arcVersion}/Avatar.json`).abi,
      deploymentState.Avatar,
      opts
    )

    daoToken = new web3.eth.Contract(
      require(`./contracts/${arcVersion}/DAOToken.json`).abi,
      await avatar.methods.nativeToken().call(),
      opts
    )

    reputation = new web3.eth.Contract(
      require(`./contracts/${arcVersion}/Reputation.json`).abi,
      await avatar.methods.nativeReputation().call(),
      opts
    )
    if (migrationParams.useUController) {
      deploymentState.Controller = UController
      controller = uController
    } else {
      spinner.start('Deploying Controller')
      controller = new web3.eth.Contract(
        require(`./contracts/${arcVersion}/Controller.json`).abi,
        await avatar.methods.owner().call(),
        opts
      )
      deploymentState.Controller = controller.options.address
    }
  } else {
    if (deploymentState.DAOToken === undefined) {
      spinner.start('Deploying DAO Token')
      daoToken = new web3.eth.Contract(
        require(`./contracts/${arcVersion}/DAOToken.json`).abi,
        undefined,
        opts
      ).deploy({
        data: require(`./contracts/${arcVersion}/DAOToken.json`).bytecode,
        arguments: [tokenName, tokenSymbol, 0]
      }).send({ nonce: ++nonce })

      tx = await new Promise(resolve => daoToken.on('receipt', resolve))
      let c = await daoToken
      await logTx(tx, `${c.options.address} => DAOToken`)
      deploymentState.DAOToken = c.options.address
      setState(deploymentState)
    }
    daoToken = new web3.eth.Contract(
      require(`./contracts/${arcVersion}/DAOToken.json`).abi,
      deploymentState.DAOToken,
      opts
    )

    if (deploymentState.Reputation === undefined) {
      spinner.start('Deploying Reputation')
      reputation = new web3.eth.Contract(
        require(`./contracts/${arcVersion}/Reputation.json`).abi,
        undefined,
        opts
      ).deploy({
        data: require(`./contracts/${arcVersion}/Reputation.json`).bytecode
      }).send({ nonce: ++nonce })

      tx = await new Promise(resolve => reputation.on('receipt', resolve))
      let c = await reputation
      await logTx(tx, `${c.options.address} => Reputation`)
      deploymentState.Reputation = c.options.address
      setState(deploymentState)
    }
    reputation = new web3.eth.Contract(
      require(`./contracts/${arcVersion}/Reputation.json`).abi,
      deploymentState.Reputation,
      opts
    )

    if (deploymentState.Avatar === undefined) {
      spinner.start('Deploying Avatar.')
      avatar = new web3.eth.Contract(
        require(`./contracts/${arcVersion}/Avatar.json`).abi,
        undefined,
        opts
      ).deploy({
        data: require(`./contracts/${arcVersion}/Avatar.json`).bytecode,
        arguments: [orgName, daoToken.options.address, reputation.options.address]
      }).send({ nonce: ++nonce })

      tx = await new Promise(resolve => avatar.on('receipt', resolve))
      let c = await avatar
      await logTx(tx, `${c.options.address} => Avatar`)
      deploymentState.Avatar = c.options.address
      setState(deploymentState)
    }
    avatar = new web3.eth.Contract(
      require(`./contracts/${arcVersion}/Avatar.json`).abi,
      deploymentState.Avatar,
      opts
    )

    if (deploymentState.foundersReputationMintedCounter === undefined) {
      deploymentState.foundersReputationMintedCounter = 0
    }
    for (deploymentState.foundersReputationMintedCounter;
      deploymentState.foundersReputationMintedCounter < founders.length;
      deploymentState.foundersReputationMintedCounter++) {
      spinner.start('Minting founders tokens and reputation')
      setState(deploymentState)

      let founder = founders[deploymentState.foundersReputationMintedCounter]

      if (founder.reputation > 0) {
        tx = await reputation.methods.mint(founder.address, web3.utils.toWei(`${founder.reputation}`)).send({ nonce: ++nonce })
        await logTx(tx, `Minted ${founder.reputation} reputation to ${founder.address}`)
      }
    }
    deploymentState.foundersReputationMintedCounter++
    setState(deploymentState)

    if (deploymentState.foundersTokenMintedCounter === undefined) {
      deploymentState.foundersTokenMintedCounter = 0
    }
    for (deploymentState.foundersTokenMintedCounter;
      deploymentState.foundersTokenMintedCounter < founders.length;
      deploymentState.foundersTokenMintedCounter++) {
      setState(deploymentState)

      let founder = founders[deploymentState.foundersTokenMintedCounter]

      if (founder.tokens > 0) {
        tx = await daoToken.methods.mint(founder.address, web3.utils.toWei(`${founder.tokens}`)).send({ nonce: ++nonce })
        await logTx(tx, `Minted ${founder.tokens} tokens to ${founder.address}`)
      }
    }
    deploymentState.foundersTokenMintedCounter++
    setState(deploymentState)

    if (migrationParams.useUController) {
      deploymentState.Controller = UController
      controller = uController
    } else {
      if (deploymentState.Controller === undefined) {
        spinner.start('Deploying Controller')
        controller = new web3.eth.Contract(
          require(`./contracts/${arcVersion}/Controller.json`).abi,
          undefined,
          opts
        ).deploy({
          data: require(`./contracts/${arcVersion}/Controller.json`).bytecode,
          arguments: [avatar.options.address]
        }).send({ nonce: ++nonce })

        tx = await new Promise(resolve => controller.on('receipt', resolve))
        let c = await controller
        await logTx(tx, `${c.options.address} => Controller`)

        deploymentState.Controller = c.options.address
        setState(deploymentState)
      }
      controller = new web3.eth.Contract(
        require(`./contracts/${arcVersion}/Controller.json`).abi,
        deploymentState.Controller,
        opts
      )
    }

    if (migrationParams.noTrack !== true && Number(arcVersion.slice(-2)) >= 29 && deploymentState.trackedDAO !== true) {
      const daoTracker = new web3.eth.Contract(
        require(`./contracts/${arcVersion}/DAOTracker.json`).abi,
        DAOTracker,
        opts
      )
      spinner.start('Registering DAO in DAOTracker')
      tx = (Number(arcVersion.slice(-2)) >= 32
        ? await daoTracker.methods.track(avatar.options.address, deploymentState.Controller, arcVersion)
        : await daoTracker.methods.track(avatar.options.address, deploymentState.Controller))
        .send({ nonce: ++nonce })
      await logTx(tx, 'Finished Registering DAO in DAOTracker')
      deploymentState.trackedDAO = true
      setState(deploymentState)
    }

    if (deploymentState.transferredAvatarOwnership !== true) {
      spinner.start('Transfer Avatar to Controller ownership')
      tx = await avatar.methods.transferOwnership(deploymentState.Controller).send({ nonce: ++nonce })
      await logTx(tx, 'Finished transferring Avatar to Controller ownership')
      deploymentState.transferredAvatarOwnership = true
      setState(deploymentState)
    }

    if (deploymentState.transferredReputationOwnership !== true) {
      spinner.start('Transfer Reputation to Controller ownership')
      tx = await reputation.methods.transferOwnership(deploymentState.Controller).send({ nonce: ++nonce })
      await logTx(tx, 'Finished transferring Reputation to Controller ownership')
      deploymentState.transferredReputationOwnership = true
      setState(deploymentState)
    }

    if (deploymentState.transferredDAOTokenOwnership !== true) {
      spinner.start('Transfer DAOToken to Controller ownership')
      tx = await daoToken.methods.transferOwnership(deploymentState.Controller).send({ nonce: ++nonce })
      await logTx(tx, 'Finished transferring DAOToken to Controller ownership')
      deploymentState.transferredDAOTokenOwnership = true
      setState(deploymentState)
    }

    if (migrationParams.useUController && deploymentState.registeredAvatarToUController !== true) {
      spinner.start('Register Avatar to UController')
      tx = await controller.methods.newOrganization(avatar.options.address).send({ nonce: ++nonce })
      await logTx(tx, 'Finished registerring Avatar')
      deploymentState.registeredAvatarToUController = true
      setState(deploymentState)
    }
  }

  const network = await web3.eth.net.getNetworkType()

  if (network === 'private') {
    const daoRegistry = new web3.eth.Contract(
      require(`./contracts/${arcVersion}/DAORegistry.json`).abi,
      DAORegistry,
      opts
    )

    if (deploymentState.proposedRegisteringDAO !== true) {
      spinner.start('Proposing DAO in DAORegistry')
      tx = await daoRegistry.methods.propose(avatar.options.address).send({ nonce: ++nonce })
      deploymentState.proposedRegisteringDAO = true
      setState(deploymentState)
      await logTx(tx, 'Finished Proposing DAO in DAORegistry')
    }
    if (deploymentState.registeredRegisteringDAO !== true) {
      spinner.start('Registering DAO in DAORegistry')
      let DAOname = await avatar.methods.orgName().call()
      tx = await daoRegistry.methods.register(avatar.options.address, DAOname).send({ nonce: ++nonce })
      deploymentState.registeredRegisteringDAO = true
      setState(deploymentState)
      await logTx(tx, 'Finished Registering DAO in DAORegistry')
    }
  }

  if (deploymentState.schemeNames === undefined) {
    deploymentState.schemeNames = []
    deploymentState.schemes = []
    deploymentState.params = []
    deploymentState.permissions = []
    deploymentState.votingMachinesParams = []
  }

  if (deploymentState.registeredGenesisProtocolParamsCount === undefined) {
    deploymentState.registeredGenesisProtocolParamsCount = 0
  }
  for (deploymentState.registeredGenesisProtocolParamsCount;
    deploymentState.registeredGenesisProtocolParamsCount < migrationParams.VotingMachinesParams.length;
    deploymentState.registeredGenesisProtocolParamsCount++) {
    spinner.start('Setting GenesisProtocol parameters...')
    setState(deploymentState)
    if (migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].votingParamsHash !== undefined) {
      deploymentState.votingMachinesParams.push(migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].votingParamsHash)
      setState(deploymentState)
      continue
    }
    let parameters = [
      [
        migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].queuedVoteRequiredPercentage.toString(),
        migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].queuedVotePeriodLimit.toString(),
        migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].boostedVotePeriodLimit.toString(),
        migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].preBoostedVotePeriodLimit.toString(),
        migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].thresholdConst.toString(),
        migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].quietEndingPeriod.toString(),
        web3.utils.toWei(migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].proposingRepReward.toString()),
        migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].votersReputationLossRatio.toString(),
        web3.utils.toWei(migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].minimumDaoBounty.toString()),
        migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].daoBountyConst.toString(),
        migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].activationTime.toString()
      ],
      migrationParams.VotingMachinesParams[deploymentState.registeredGenesisProtocolParamsCount].voteOnBehalf
    ]
    const genesisProtocolSetParams = genesisProtocol.methods.setParameters(...parameters)

    tx = await genesisProtocolSetParams.send({ nonce: ++nonce })
    let votingMachinesParams = await genesisProtocolSetParams.call()
    deploymentState.votingMachinesParams.push(votingMachinesParams)
    await logTx(tx,
      'GenesisProtocol parameters set. | Params Hash: ' +
      votingMachinesParams + '\nParameters:\n' +
      parameters.toString().replace(/,/g, ',\n')
    )
    setState(deploymentState)
  }
  deploymentState.registeredGenesisProtocolParamsCount++
  setState(deploymentState)

  if (migrationParams.schemes.SchemeRegistrar) {
    if (deploymentState.SchemeRegistrarParamsCount === undefined) {
      deploymentState.SchemeRegistrarParamsCount = 0
    }
    for (deploymentState.SchemeRegistrarParamsCount;
      deploymentState.SchemeRegistrarParamsCount < migrationParams.SchemeRegistrar.length;
      deploymentState.SchemeRegistrarParamsCount++) {
      setState(deploymentState)

      spinner.start('Setting Scheme Registrar parameters...')
      let parameters = [
        migrationParams.SchemeRegistrar[deploymentState.SchemeRegistrarParamsCount].voteRegisterParams === undefined
          ? deploymentState.votingMachinesParams[0]
          : deploymentState.votingMachinesParams[migrationParams.SchemeRegistrar[deploymentState.SchemeRegistrarParamsCount].voteRegisterParams],
        migrationParams.SchemeRegistrar[deploymentState.SchemeRegistrarParamsCount].voteRemoveParams === undefined
          ? deploymentState.votingMachinesParams[0]
          : deploymentState.votingMachinesParams[migrationParams.SchemeRegistrar[deploymentState.SchemeRegistrarParamsCount].voteRemoveParams],
        migrationParams.SchemeRegistrar[deploymentState.SchemeRegistrarParamsCount].votingMachine === undefined
          ? GenesisProtocol
          : migrationParams.SchemeRegistrar[deploymentState.SchemeRegistrarParamsCount].votingMachine
      ]
      const schemeRegistrarSetParams = schemeRegistrar.methods.setParameters(...parameters)
      schemeRegistrarParams = await schemeRegistrarSetParams.call()
      tx = await schemeRegistrarSetParams.send({ nonce: ++nonce })
      await logTx(tx,
        'Scheme Registrar parameters set. | Params Hash: ' +
        schemeRegistrarParams + '\nParameters:\n' +
        parameters.toString().replace(/,/g, ',\n')
      )

      deploymentState.schemeNames.push('Scheme Registrar')
      deploymentState.schemes.push(SchemeRegistrar)
      deploymentState.params.push(schemeRegistrarParams)
      deploymentState.permissions.push('0x0000001F')
      setState(deploymentState)
    }
    deploymentState.SchemeRegistrarParamsCount++
    setState(deploymentState)
  }

  if (migrationParams.schemes.ContributionReward) {
    if (deploymentState.ContributionRewardParamsCount === undefined) {
      deploymentState.ContributionRewardParamsCount = 0
    }
    for (deploymentState.ContributionRewardParamsCount;
      deploymentState.ContributionRewardParamsCount < migrationParams.ContributionReward.length;
      deploymentState.ContributionRewardParamsCount++) {
      setState(deploymentState)
      spinner.start('Setting Contribution Reward parameters...')
      let parameters = [migrationParams.ContributionReward[deploymentState.ContributionRewardParamsCount].voteParams === undefined
        ? deploymentState.votingMachinesParams[0]
        : deploymentState.votingMachinesParams[migrationParams.ContributionReward[deploymentState.ContributionRewardParamsCount].voteParams],
      migrationParams.ContributionReward[deploymentState.ContributionRewardParamsCount].votingMachine === undefined
        ? GenesisProtocol
        : migrationParams.ContributionReward[deploymentState.ContributionRewardParamsCount].votingMachine]
      const contributionRewardSetParams = contributionReward.methods.setParameters(...parameters)
      contributionRewardParams = await contributionRewardSetParams.call()
      tx = await contributionRewardSetParams.send({ nonce: ++nonce })
      await logTx(tx,
        'Contribution Reward parameters set. | Params Hash: ' +
        contributionRewardParams + '\nParameters:' +
        parameters.toString().replace(/,/g, ',\n')
      )

      deploymentState.schemeNames.push('Contribution Reward')
      deploymentState.schemes.push(ContributionReward)
      deploymentState.params.push(contributionRewardParams)
      deploymentState.permissions.push('0x00000000')
      setState(deploymentState)
    }
    deploymentState.ContributionRewardParamsCount++
    setState(deploymentState)
  }

  if (migrationParams.schemes.UGenericScheme) {
    if (deploymentState.UGenericSchemeParamsCount === undefined) {
      deploymentState.UGenericSchemeParamsCount = 0
    }
    for (deploymentState.UGenericSchemeParamsCount;
      deploymentState.UGenericSchemeParamsCount < migrationParams.UGenericScheme.length;
      deploymentState.UGenericSchemeParamsCount++) {
      setState(deploymentState)
      spinner.start('Setting Generic Scheme parameters...')
      let parameters = [
        migrationParams.UGenericScheme[deploymentState.UGenericSchemeParamsCount].voteParams === undefined ? deploymentState.votingMachinesParams[0] : deploymentState.votingMachinesParams[migrationParams.UGenericScheme[deploymentState.UGenericSchemeParamsCount].voteParams],
        migrationParams.UGenericScheme[deploymentState.UGenericSchemeParamsCount].votingMachine === undefined ? GenesisProtocol : migrationParams.UGenericScheme[deploymentState.UGenericSchemeParamsCount].votingMachine,
        migrationParams.UGenericScheme[deploymentState.UGenericSchemeParamsCount].targetContract
      ]
      const genericSchemeSetParams = genericScheme.methods.setParameters(...parameters)
      genericSchemeParams = await genericSchemeSetParams.call()
      tx = await genericSchemeSetParams.send({ nonce: ++nonce })
      await logTx(tx,
        'Generic Scheme parameters set. | Params Hash: ' +
        genericSchemeParams + '\nParameters:\n' +
        parameters.toString().replace(/,/g, ',\n')
      )

      deploymentState.schemeNames.push('Generic Scheme')
      deploymentState.schemes.push(Number(arcVersion.slice(-2)) >= 24 ? UGenericScheme : GenericScheme)
      deploymentState.params.push(genericSchemeParams)
      deploymentState.permissions.push('0x00000010')
      setState(deploymentState)
    }
    deploymentState.UGenericSchemeParamsCount++
    setState(deploymentState)
  }

  if (migrationParams.schemes.GlobalConstraintRegistrar) {
    if (deploymentState.GlobalConstraintRegistrarParamsCount === undefined) {
      deploymentState.GlobalConstraintRegistrarParamsCount = 0
    }
    for (deploymentState.GlobalConstraintRegistrarParamsCount;
      deploymentState.GlobalConstraintRegistrarParamsCount < migrationParams.GlobalConstraintRegistrar.length;
      deploymentState.GlobalConstraintRegistrarParamsCount++) {
      setState(deploymentState)
      spinner.start('Setting Global Constraint Registrar parameters...')
      let parameters = [
        migrationParams.GlobalConstraintRegistrar[deploymentState.GlobalConstraintRegistrarParamsCount].voteParams === undefined
          ? deploymentState.votingMachinesParams[0]
          : deploymentState.votingMachinesParams[migrationParams.GlobalConstraintRegistrar[deploymentState.GlobalConstraintRegistrarParamsCount].voteParams],
        migrationParams.GlobalConstraintRegistrar[deploymentState.GlobalConstraintRegistrarParamsCount].votingMachine === undefined
          ? GenesisProtocol
          : migrationParams.GlobalConstraintRegistrar[deploymentState.GlobalConstraintRegistrarParamsCount].votingMachine
      ]
      const globalConstraintRegistrarSetParams = globalConstraintRegistrar.methods.setParameters(...parameters)
      globalConstraintRegistrarParams = await globalConstraintRegistrarSetParams.call()
      tx = await globalConstraintRegistrarSetParams.send({ nonce: ++nonce })
      await logTx(tx,
        'Global Constraints Registrar parameters set. | Params Hash: ' +
        globalConstraintRegistrarParams + '\nParameters:\n' +
        parameters.toString().replace(/,/g, ',\n')
      )

      deploymentState.schemeNames.push('Global Constraints Registrar')
      deploymentState.schemes.push(GlobalConstraintRegistrar)
      deploymentState.params.push(globalConstraintRegistrarParams)
      deploymentState.permissions.push('0x00000004')
      setState(deploymentState)
    }
    deploymentState.GlobalConstraintRegistrarParamsCount++
    setState(deploymentState)
  }

  if (migrationParams.schemes.UpgradeScheme) {
    if (deploymentState.UpgradeSchemeParamsCount === undefined) {
      deploymentState.UpgradeSchemeParamsCount = 0
    }
    for (deploymentState.UpgradeSchemeParamsCount;
      deploymentState.UpgradeSchemeParamsCount < migrationParams.UpgradeScheme.length;
      deploymentState.UpgradeSchemeParamsCount++) {
      setState(deploymentState)
      spinner.start('Setting Upgrade Scheme parameters...')
      let parameters = [
        migrationParams.UpgradeScheme[deploymentState.UpgradeSchemeParamsCount].voteParams === undefined
          ? deploymentState.votingMachinesParams[0]
          : deploymentState.votingMachinesParams[migrationParams.UpgradeScheme[deploymentState.UpgradeSchemeParamsCount].voteParams],
        migrationParams.UpgradeScheme[deploymentState.UpgradeSchemeParamsCount].votingMachine === undefined
          ? GenesisProtocol
          : migrationParams.UpgradeScheme[deploymentState.UpgradeSchemeParamsCount].votingMachine
      ]
      const upgradeSchemeSetParams = upgradeScheme.methods.setParameters(...parameters)
      upgradeSchemeParams = await upgradeSchemeSetParams.call()
      tx = await upgradeSchemeSetParams.send({ nonce: ++nonce })
      await logTx(tx,
        'Upgrade Scheme parameters set. | Params Hash: ' +
        upgradeSchemeParams + '\nParameters:\n' +
        parameters.toString().replace(/,/g, ',\n')
      )

      deploymentState.schemeNames.push('Upgrade Scheme')
      deploymentState.schemes.push(UpgradeScheme)
      deploymentState.params.push(upgradeSchemeParams)
      deploymentState.permissions.push('0x0000000A')
      setState(deploymentState)
    }
    deploymentState.UpgradeSchemeParamsCount++
    setState(deploymentState)
  }

  if (migrationParams.StandAloneContracts) {
    let len = migrationParams.StandAloneContracts.length
    if (deploymentState.standAloneContractsCounter === undefined) {
      deploymentState.standAloneContractsCounter = 0
    }
    for (deploymentState.standAloneContractsCounter;
      deploymentState.standAloneContractsCounter < len;
      deploymentState.standAloneContractsCounter++) {
      setState(deploymentState)
      let standAlone = migrationParams.StandAloneContracts[deploymentState.standAloneContractsCounter]

      const path = require('path')
      let contractJson
      if (standAlone.fromArc) {
        contractJson = require(`./contracts/${arcVersion}/${standAlone.name}.json`)
      } else {
        contractJson = require(path.resolve(`${customAbisLocation}/${standAlone.name}.json`))
      }
      let abi = contractJson.abi
      let bytecode = contractJson.bytecode
      let standAloneContract

      spinner.start(`Migrating ${standAlone.name}...`)
      const StandAloneContract = new web3.eth.Contract(abi, undefined, opts)
      const standAloneDeployedContract = StandAloneContract.deploy({
        data: bytecode,
        arguments: null
      }).send({ nonce: ++nonce })
      tx = await new Promise(resolve => standAloneDeployedContract.on('receipt', resolve))
      standAloneContract = await standAloneDeployedContract
      await logTx(tx, `${standAloneContract.options.address} => ${standAlone.name}`)

      if (standAlone.params !== undefined) {
        spinner.start(`Initializing ${standAlone.name}...`)
        let contractParams = []
        for (let i in standAlone.params) {
          if (standAlone.params[i].StandAloneContract !== undefined) {
            contractParams.push(deploymentState.StandAloneContracts[standAlone.params[i].StandAloneContract].address)
          } else {
            contractParams.push(standAlone.params[i])
          }
        }
        const contractSetParams = standAloneContract.methods.initialize(...contractParams)

        tx = await contractSetParams.send({ nonce: ++nonce })
        await logTx(tx, `${standAlone.name} initialized.`)
      }

      if (standAlone.runFunctions !== undefined) {
        for (let i in standAlone.runFunctions) {
          spinner.start(`Calling ${standAlone.name} - ${standAlone.runFunctions[i].functionName}...`)
          let functionParams = []
          for (let j in standAlone.runFunctions[i].params) {
            if (standAlone.runFunctions[i].params[j].StandAloneContract !== undefined) {
              functionParams.push(deploymentState.StandAloneContracts[standAlone.runFunctions[i].params[j].StandAloneContract].address)
            } else if (standAlone.runFunctions[i].params[j] === 'AvatarAddress') {
              functionParams.push(avatar.options.address)
            } else {
              functionParams.push(standAlone.runFunctions[i].params[j])
            }
          }
          const functionCall = standAloneContract.methods[standAlone.runFunctions[i].functionName](...functionParams)

          tx = await functionCall.send({ nonce: ++nonce })
          await logTx(tx, `${standAlone.name} called function ${standAlone.runFunctions[i].functionName}.`)
        }
      }

      deploymentState.StandAloneContracts.push({ name: standAlone.name, alias: standAlone.alias, address: standAloneContract.options.address })
      setState(deploymentState)
    }
    deploymentState.standAloneContractsCounter++
    setState(deploymentState)
  }

  if (migrationParams.CustomSchemes) {
    let len = migrationParams.CustomSchemes.length
    if (deploymentState.CustomSchemeCounter === undefined) {
      deploymentState.CustomSchemeCounter = 0
    }
    for (deploymentState.CustomSchemeCounter;
      deploymentState.CustomSchemeCounter < len; deploymentState.CustomSchemeCounter++) {
      setState(deploymentState)
      let customeScheme = migrationParams.CustomSchemes[deploymentState.CustomSchemeCounter]
      const path = require('path')
      let contractJson
      if (customeScheme.fromArc) {
        contractJson = require(`./contracts/${arcVersion}/${customeScheme.name}.json`)
      } else {
        contractJson = require(path.resolve(`${customAbisLocation}/${customeScheme.name}.json`))
      }
      let abi = contractJson.abi
      let bytecode = contractJson.bytecode
      let schemeContract
      if (customeScheme.address === undefined) {
        spinner.start(`Migrating ${customeScheme.name}...`)
        const SchemeContract = new web3.eth.Contract(abi, undefined, opts)
        const schemeDeployedContract = SchemeContract.deploy({
          data: bytecode,
          arguments: null
        }).send({ nonce: ++nonce })
        tx = await new Promise(resolve => schemeDeployedContract.on('receipt', resolve))
        schemeContract = await schemeDeployedContract
        await logTx(tx, `${schemeContract.options.address} => ${customeScheme.name}`)
      } else {
        schemeContract = new web3.eth.Contract(abi, customeScheme.address, opts)
      }

      let schemeParamsHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
      if (customeScheme.isUniversal) {
        spinner.start(`Setting ${customeScheme.name} parameters...`)
        let schemeParams = []
        for (let i in customeScheme.params) {
          if (customeScheme.params[i].voteParams !== undefined) {
            schemeParams.push(deploymentState.votingMachinesParams[customeScheme.params[i].voteParams])
          } else if (customeScheme.params[i] === 'GenesisProtocolAddress') {
            schemeParams.push(GenesisProtocol)
          } else {
            schemeParams.push(customeScheme.params[i])
          }
        }
        const schemeSetParams = schemeContract.methods.setParameters(...schemeParams)
        schemeParamsHash = await schemeSetParams.call()
        tx = await schemeSetParams.send({ nonce: ++nonce })
        await logTx(tx,
          customeScheme.name + ' parameters set. | Params Hash: ' +
          schemeParamsHash + '\nParameters:\n' +
          schemeParams.toString().replace(/,/g, ',\n')
        )
      } else if (schemeContract.methods.initialize !== undefined) {
        spinner.start(`Initializing ${customeScheme.name}...`)
        let schemeParams = [avatar.options.address]
        for (let i in customeScheme.params) {
          if (customeScheme.params[i].voteParams !== undefined) {
            schemeParams.push(deploymentState.votingMachinesParams[customeScheme.params[i].voteParams])
          } else if (customeScheme.params[i] === 'GenesisProtocolAddress') {
            schemeParams.push(GenesisProtocol)
          } else if (customeScheme.params[i].StandAloneContract !== undefined) {
            schemeParams.push(deploymentState.StandAloneContracts[customeScheme.params[i].StandAloneContract].address)
          } else if (customeScheme.params[i] === 'AvatarAddress') {
            schemeParams.push(avatar.options.address)
          } else {
            schemeParams.push(customeScheme.params[i])
          }
        }
        const schemeSetParams = schemeContract.methods.initialize(...schemeParams)
        schemeParamsHash = await schemeSetParams.call()
        if (schemeParamsHash.Result === undefined) {
          schemeParamsHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
        }
        tx = await schemeSetParams.send({ nonce: ++nonce })
        await logTx(tx, `${customeScheme.name} initialized.`)
      } else {
        continue
      }

      deploymentState.schemeNames.push(customeScheme.name)
      deploymentState.schemes.push(schemeContract.options.address)
      deploymentState.params.push(schemeParamsHash)
      deploymentState.permissions.push(customeScheme.permissions)
      deploymentState.Schemes.push({ name: customeScheme.name, alias: customeScheme.alias, address: schemeContract.options.address })
      setState(deploymentState)
    }
    deploymentState.CustomSchemeCounter++
    setState(deploymentState)
  }

  if (deploymentState.schemesSet !== true) {
    if (migrationParams.useDaoCreator === true) {
      spinner.start('Setting DAO schemes...')
      tx = await daoCreator.methods.setSchemes(avatar.options.address, deploymentState.schemes, deploymentState.params, deploymentState.permissions, 'metaData').send({ nonce: ++nonce })
      await logTx(tx, 'DAO schemes set.')
      deploymentState.schemesSet = true
      setState(deploymentState)
    } else {
      for (let i = deploymentState.schemesSetCounter === undefined ? 0 : deploymentState.schemesSetCounter;
        i < deploymentState.schemes.length; i++) {
        deploymentState.schemesSetCounter = i
        setState(deploymentState)
        spinner.start('Registering ' + deploymentState.schemeNames[i] + ' to the DAO...')
        tx = await controller.methods.registerScheme(deploymentState.schemes[i], deploymentState.params[i], deploymentState.permissions[i], avatar.options.address).send({ nonce: ++nonce })
        await logTx(tx, deploymentState.schemeNames[i] + ' was successfully registered to the DAO.')
      }
      deploymentState.schemesSet = true
      setState(deploymentState)
    }
    deploymentState.schemesSetCounter++
    setState(deploymentState)
  }

  console.log(
    JSON.stringify({
      name: orgName,
      Avatar: avatar.options.address,
      DAOToken: daoToken.options.address,
      Reputation: reputation.options.address,
      Controller: deploymentState.Controller,
      Schemes: deploymentState.Schemes,
      arcVersion
    }, null, 2)
  )
  let migration = { 'dao': previousMigration.dao || {} }
  migration.dao[arcVersion] = {
    name: orgName,
    Avatar: avatar.options.address,
    DAOToken: daoToken.options.address,
    Reputation: reputation.options.address,
    Controller: deploymentState.Controller,
    Schemes: deploymentState.Schemes,
    arcVersion
  }

  cleanState()
  spinner.info('DAO Migration has Finished Successfully!')
  return migration
}

module.exports = migrateDAO
