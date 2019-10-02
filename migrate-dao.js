const utils = require('./utils.js')
const sanitize = require('./sanitize')

async function migrateDAO ({ web3, spinner, confirm, opts, migrationParams, logTx, previousMigration, customabislocation }) {
  // sanitize the parameters
  sanitize(migrationParams)

  let base = previousMigration.base
  if (!(await confirm('About to migrate new DAO. Continue?'))) {
    return
  }

  let arcVersion = require('./package.json').dependencies['@daostack/arc']

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
    SchemeRegistrar,
    ContributionReward,
    UGenericScheme,
    GenericScheme,
    GenesisProtocol,
    GlobalConstraintRegistrar,
    UpgradeScheme
  } = base[arcVersion]

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
    Number(arcVersion.slice(-2)) >= 24 ? require('@daostack/arc/build/contracts/UGenericScheme.json').abi : require('@daostack/arc/build/contracts/GenericScheme.json').abi,
    Number(arcVersion.slice(-2)) >= 24 ? UGenericScheme : GenericScheme,
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

  let avatar
  let daoToken
  let reputation
  let Controller
  let controller
  let Schemes = []
  let StandAloneContracts = []

  if (migrationParams.useDaoCreator === true) {
    spinner.start('Creating a new organization...')

    const [founderAddresses, tokenDist, repDist] = [
      founders.map(({ address }) => address),
      founders.map(({ tokens }) => web3.utils.toWei(tokens !== undefined ? tokens.toString() : '0')),
      founders.map(({ reputation }) => web3.utils.toWei(reputation !== undefined ? reputation.toString() : '0'))
    ]

    const initFoundersBatchSize = 20
    const foundersBatchSize = 100
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

    const Avatar = tx.events.NewOrg.returnValues._avatar

    await logTx(tx, 'Created new organization.')

    let foundersToAddCount = founderAddresses.length - initFoundersBatchSize
    let i = 0
    while (foundersToAddCount > 0) {
      spinner.start('Adding founders...')
      let currentBatchCount = foundersToAddCount < foundersBatchSize ? foundersToAddCount : foundersBatchSize
      tx = await daoCreator.methods.addFounders(
        Avatar,
        founderAddresses.slice(i * foundersBatchSize + initFoundersBatchSize, i * foundersBatchSize + currentBatchCount + initFoundersBatchSize),
        tokenDist.slice(i * foundersBatchSize + initFoundersBatchSize, i * foundersBatchSize + currentBatchCount + initFoundersBatchSize),
        repDist.slice(i * foundersBatchSize + initFoundersBatchSize, i * foundersBatchSize + currentBatchCount + initFoundersBatchSize)
      ).send({ nonce: ++nonce })
      await logTx(tx, 'Finished adding founders.')
      foundersToAddCount -= foundersBatchSize
      i++
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
    daoToken = new web3.eth.Contract(
      require('@daostack/arc/build/contracts/DAOToken.json').abi,
      undefined,
      opts
    ).deploy({
      data: require('@daostack/arc/build/contracts/DAOToken.json').bytecode,
      arguments: [tokenName, tokenSymbol, 0]
    }).send({ nonce: ++nonce })

    tx = await new Promise(resolve => daoToken.on('receipt', resolve))
    let c = await daoToken
    await logTx(tx, `${c.options.address} => DAOToken`)
    daoToken = new web3.eth.Contract(
      require('@daostack/arc/build/contracts/DAOToken.json').abi,
      c.options.address,
      opts
    )

    spinner.start('Deploying Reputation')
    reputation = new web3.eth.Contract(
      require('@daostack/arc/build/contracts/Reputation.json').abi,
      undefined,
      opts
    ).deploy({
      data: require('@daostack/arc/build/contracts/Reputation.json').bytecode
    }).send({ nonce: ++nonce })

    tx = await new Promise(resolve => reputation.on('receipt', resolve))
    c = await reputation
    await logTx(tx, `${c.options.address} => Reputation`)
    reputation = new web3.eth.Contract(
      require('@daostack/arc/build/contracts/Reputation.json').abi,
      c.options.address,
      opts
    )

    spinner.start('Deploying Avatar.')
    avatar = new web3.eth.Contract(
      require('@daostack/arc/build/contracts/Avatar.json').abi,
      undefined,
      opts
    ).deploy({
      data: require('@daostack/arc/build/contracts/Avatar.json').bytecode,
      arguments: [orgName, daoToken.options.address, reputation.options.address]
    }).send({ nonce: ++nonce })

    tx = await new Promise(resolve => avatar.on('receipt', resolve))
    c = await avatar
    await logTx(tx, `${c.options.address} => Avatar`)
    avatar = new web3.eth.Contract(
      require('@daostack/arc/build/contracts/Avatar.json').abi,
      c.options.address,
      opts
    )

    spinner.start('Minting founders tokens and reputation')
    for (let i in founders) {
      let founder = founders[i]

      if (founder.reputation > 0) {
        tx = await reputation.methods.mint(founder.address, web3.utils.toWei(`${founder.reputation}`)).send({ nonce: ++nonce })
        await logTx(tx, `Minted ${founder.reputation} reputation to ${founder.address}`)
      }
      if (founder.tokens > 0) {
        tx = await daoToken.methods.mint(founder.address, web3.utils.toWei(`${founder.tokens}`)).send({ nonce: ++nonce })
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
      }).send({ nonce: ++nonce }))
      Controller = controller.options.address
    }

    spinner.start('Transfer Avatar to Controller ownership')
    tx = await avatar.methods.transferOwnership(Controller).send({ nonce: ++nonce })
    await logTx(tx, 'Finished transferring Avatar to Controller ownership')

    spinner.start('Transfer Reputation to Controller ownership')
    tx = await reputation.methods.transferOwnership(Controller).send({ nonce: ++nonce })
    await logTx(tx, 'Finished transferring Reputation to Controller ownership')

    spinner.start('Transfer DAOToken to Controller ownership')
    tx = await daoToken.methods.transferOwnership(Controller).send({ nonce: ++nonce })
    await logTx(tx, 'Finished transferring DAOToken to Controller ownership')

    if (migrationParams.useUController) {
      spinner.start('Register Avatar to UController')
      tx = await controller.methods.newOrganization(avatar.options.address).send({ nonce: ++nonce })
      await logTx(tx, 'Finished registerring Avatar')
    }
  }

  const network = await web3.eth.net.getNetworkType()

  if (network === 'private') {
    const daoRegistry = new web3.eth.Contract(
      require('@daostack/arc-hive/build/contracts/DAORegistry.json').abi,
      DAORegistry,
      opts
    )
    spinner.start('Registering DAO in DAORegistry')
    let DAOname = await avatar.methods.orgName().call()
    tx = await daoRegistry.methods.propose(avatar.options.address).send({ nonce: ++nonce })
    tx = await daoRegistry.methods.register(avatar.options.address, DAOname).send({ nonce: ++nonce })
    await logTx(tx, 'Finished Registering DAO in DAORegistry')
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
        migrationParams.VotingMachinesParams[i].queuedVoteRequiredPercentage.toString(),
        migrationParams.VotingMachinesParams[i].queuedVotePeriodLimit.toString(),
        migrationParams.VotingMachinesParams[i].boostedVotePeriodLimit.toString(),
        migrationParams.VotingMachinesParams[i].preBoostedVotePeriodLimit.toString(),
        migrationParams.VotingMachinesParams[i].thresholdConst.toString(),
        migrationParams.VotingMachinesParams[i].quietEndingPeriod.toString(),
        web3.utils.toWei(migrationParams.VotingMachinesParams[i].proposingRepReward.toString()),
        migrationParams.VotingMachinesParams[i].votersReputationLossRatio.toString(),
        web3.utils.toWei(migrationParams.VotingMachinesParams[i].minimumDaoBounty.toString()),
        migrationParams.VotingMachinesParams[i].daoBountyConst.toString(),
        migrationParams.VotingMachinesParams[i].activationTime.toString()
      ],
      migrationParams.VotingMachinesParams[i].voteOnBehalf
    )

    votingMachinesParams.push(await genesisProtocolSetParams.call())
    tx = await genesisProtocolSetParams.send({ nonce: ++nonce })
    await logTx(tx, 'GenesisProtocol parameters set.')
  }

  if (migrationParams.schemes.SchemeRegistrar) {
    for (let i in migrationParams.SchemeRegistrar) {
      spinner.start('Setting Scheme Registrar parameters...')
      const schemeRegistrarSetParams = schemeRegistrar.methods.setParameters(
        migrationParams.SchemeRegistrar[i].voteRegisterParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.SchemeRegistrar[i].voteRegisterParams],
        migrationParams.SchemeRegistrar[i].voteRemoveParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.SchemeRegistrar[i].voteRemoveParams],
        migrationParams.SchemeRegistrar[i].votingMachine === undefined ? GenesisProtocol : migrationParams.SchemeRegistrar[i].votingMachine
      )
      schemeRegistrarParams = await schemeRegistrarSetParams.call()
      tx = await schemeRegistrarSetParams.send({ nonce: ++nonce })
      await logTx(tx, 'Scheme Registrar parameters set.')
      schemeNames.push('Scheme Registrar')
      schemes.push(SchemeRegistrar)
      params.push(schemeRegistrarParams)
      permissions.push('0x0000001F')
    }
  }

  if (migrationParams.schemes.ContributionReward) {
    for (let i in migrationParams.ContributionReward) {
      spinner.start('Setting Contribution Reward parameters...')
      const contributionRewardSetParams = contributionReward.methods.setParameters(
        migrationParams.ContributionReward[i].voteParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.ContributionReward[i].voteParams],
        migrationParams.ContributionReward[i].votingMachine === undefined ? GenesisProtocol : migrationParams.ContributionReward[i].votingMachine
      )
      contributionRewardParams = await contributionRewardSetParams.call()
      tx = await contributionRewardSetParams.send({ nonce: ++nonce })
      await logTx(tx, 'Contribution Reward parameters set.')
      schemeNames.push('Contribution Reward')
      schemes.push(ContributionReward)
      params.push(contributionRewardParams)
      permissions.push('0x00000000')
    }
  }

  if (migrationParams.schemes.UGenericScheme) {
    for (let i in migrationParams.UGenericScheme) {
      spinner.start('Setting Generic Scheme parameters...')
      const genericSchemeSetParams = genericScheme.methods.setParameters(
        migrationParams.UGenericScheme[i].voteParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.UGenericScheme[i].voteParams],
        migrationParams.UGenericScheme[i].votingMachine === undefined ? GenesisProtocol : migrationParams.UGenericScheme[i].votingMachine,
        migrationParams.UGenericScheme[i].targetContract
      )
      genericSchemeParams = await genericSchemeSetParams.call()
      tx = await genericSchemeSetParams.send({ nonce: ++nonce })
      await logTx(tx, 'Generic Scheme parameters set.')
      schemeNames.push('Generic Scheme')
      schemes.push(Number(arcVersion.slice(-2)) >= 24 ? UGenericScheme : GenericScheme)
      params.push(genericSchemeParams)
      permissions.push('0x00000010')
    }
  }

  if (migrationParams.schemes.GlobalConstraintRegistrar) {
    for (let i in migrationParams.GlobalConstraintRegistrar) {
      spinner.start('Setting Global Constraint Registrar parameters...')
      const globalConstraintRegistrarSetParams = globalConstraintRegistrar.methods.setParameters(
        migrationParams.GlobalConstraintRegistrar[i].voteParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.GlobalConstraintRegistrar[i].voteParams],
        migrationParams.GlobalConstraintRegistrar[i].votingMachine === undefined ? GenesisProtocol : migrationParams.GlobalConstraintRegistrar[i].votingMachine
      )
      globalConstraintRegistrarParams = await globalConstraintRegistrarSetParams.call()
      tx = await globalConstraintRegistrarSetParams.send({ nonce: ++nonce })
      await logTx(tx, 'Global Constraints Registrar parameters set.')
      schemeNames.push('Global Constraints Registrar')
      schemes.push(GlobalConstraintRegistrar)
      params.push(globalConstraintRegistrarParams)
      permissions.push('0x00000004')
    }
  }

  if (migrationParams.schemes.UpgradeScheme) {
    for (let i in migrationParams.UpgradeScheme) {
      spinner.start('Setting Upgrade Scheme parameters...')
      const upgradeSchemeSetParams = upgradeScheme.methods.setParameters(
        migrationParams.UpgradeScheme[i].voteParams === undefined ? votingMachinesParams[0] : votingMachinesParams[migrationParams.UpgradeScheme[i].voteParams],
        migrationParams.UpgradeScheme[i].votingMachine === undefined ? GenesisProtocol : migrationParams.UpgradeScheme[i].votingMachine
      )
      upgradeSchemeParams = await upgradeSchemeSetParams.call()
      tx = await upgradeSchemeSetParams.send({ nonce: ++nonce })
      await logTx(tx, 'Upgrade Scheme parameters set.')
      schemeNames.push('Upgrade Scheme')
      schemes.push(UpgradeScheme)
      params.push(upgradeSchemeParams)
      permissions.push('0x0000000A')
    }
  }

  if (migrationParams.StandAloneContracts) {
    for (let i = 0, len = migrationParams.StandAloneContracts.length; i < len; i++) {
      let standAlone = migrationParams.StandAloneContracts[i]

      const path = require('path')
      let contractJson
      if (standAlone.fromArc) {
        contractJson = require(`@daostack/arc/build/contracts/${standAlone.name}.json`)
      } else {
        contractJson = require(path.resolve(`${customabislocation}/${standAlone.name}.json`))
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
        let contractParams = []
        for (let i in standAlone.params) {
          if (standAlone.params[i].StandAloneContract !== undefined) {
            contractParams.push(StandAloneContracts[standAlone.params[i].StandAloneContract].address)
          } else {
            contractParams.push(standAlone.params[i])
          }
        }
        const contractSetParams = standAloneContract.methods.initialize(...contractParams)

        tx = await contractSetParams.send({ nonce: ++nonce })
        await logTx(tx, `${standAlone.name} initialized.`)
      }
      StandAloneContracts.push({ name: standAlone.name, alias: standAlone.alias, address: standAloneContract.options.address })
    }
  }

  if (migrationParams.CustomSchemes) {
    for (var i = 0, len = migrationParams.CustomSchemes.length; i < len; i++) {
      let customeScheme = migrationParams.CustomSchemes[i]
      const path = require('path')
      let contractJson
      if (customeScheme.fromArc) {
        contractJson = require(`@daostack/arc/build/contracts/${customeScheme.name}.json`)
      } else {
        contractJson = require(path.resolve(`${customabislocation}/${customeScheme.name}.json`))
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
        schemeContract = new web3.eth.Contract(abi, customeScheme.name.address, opts)
      }

      let schemeParamsHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
      if (customeScheme.isUniversal) {
        spinner.start(`Setting ${customeScheme.name} parameters...`)
        let schemeParams = []
        for (let i in customeScheme.params) {
          if (customeScheme.params[i].voteParams !== undefined) {
            schemeParams.push(votingMachinesParams[customeScheme.params[i].voteParams])
          } else if (customeScheme.params[i] === 'GenesisProtocolAddress') {
            schemeParams.push(GenesisProtocol)
          } else {
            schemeParams.push(customeScheme.params[i])
          }
        }
        const schemeSetParams = schemeContract.methods.setParameters(...schemeParams)
        schemeParamsHash = await schemeSetParams.call()
        tx = await schemeSetParams.send({ nonce: ++nonce })
        await logTx(tx, `${customeScheme.name} parameters set.`)
      } else if (schemeContract.methods.initialize !== undefined) {
        spinner.start(`Initializing ${customeScheme.name}...`)
        let schemeParams = [avatar.options.address]
        for (let i in customeScheme.params) {
          if (customeScheme.params[i].voteParams !== undefined) {
            schemeParams.push(votingMachinesParams[customeScheme.params[i].voteParams])
          } else if (customeScheme.params[i] === 'GenesisProtocolAddress') {
            schemeParams.push(GenesisProtocol)
          } else if (customeScheme.params[i].StandAloneContract !== undefined) {
            schemeParams.push(StandAloneContracts[customeScheme.params[i].StandAloneContract].address)
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

      schemeNames.push(customeScheme.name)
      schemes.push(schemeContract.options.address)
      params.push(schemeParamsHash)
      permissions.push(customeScheme.permissions)
      Schemes.push({ name: customeScheme.name, alias: customeScheme.alias, address: schemeContract.options.address })
    }
  }

  if (migrationParams.useDaoCreator === true) {
    spinner.start('Setting DAO schemes...')
    tx = await daoCreator.methods.setSchemes(avatar.options.address, schemes, params, permissions, 'metaData').send({ nonce: ++nonce })
    await logTx(tx, 'DAO schemes set.')
  } else {
    for (let i in schemes) {
      spinner.start('Registering ' + schemeNames[i] + ' to the DAO...')
      tx = await controller.methods.registerScheme(schemes[i], params[i], permissions[i], avatar.options.address).send({ nonce: ++nonce })
      await logTx(tx, schemeNames[i] + ' was successfully registered to the DAO.')
    }
  }

  console.log(
    {
      name: orgName,
      Avatar: avatar.options.address,
      DAOToken: daoToken.options.address,
      Reputation: reputation.options.address,
      Controller,
      Schemes
    }
  )
  let migration = { 'dao': previousMigration.dao || {} }
  migration.dao[arcVersion] = {
    name: orgName,
    Avatar: avatar.options.address,
    DAOToken: daoToken.options.address,
    Reputation: reputation.options.address,
    Controller,
    Schemes
  }
  return migration
}

module.exports = migrateDAO
