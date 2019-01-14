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
  let tx

  const {
    UController,
    DaoCreator,
    SchemeRegistrar,
    GlobalConstraintRegistrar,
    UpgradeScheme,
    ContributionReward,
    GenesisProtocol,
    AbsoluteVote
  } = base

  const daoCreator = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/DaoCreator.json').abi,
    DaoCreator,
    opts
  )
  const schemeRegistrar = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/SchemeRegistrar.json').abi,
    SchemeRegistrar,
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
  const contributionReward = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/ContributionReward.json').abi,
    ContributionReward,
    opts
  )
  const genesisProtocol = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/GenesisProtocol.json').abi,
    GenesisProtocol,
    opts
  )
  const absoluteVote = new web3.eth.Contract(
    require('@daostack/arc/build/contracts/AbsoluteVote.json').abi,
    AbsoluteVote,
    opts
  )

  const [orgName, tokenName, tokenSymbol, founderAddresses, tokenDist, repDist, uController, cap] = [
    'Genesis Test',
    'Genesis Test',
    'GDT',
    migrationParams.founders.map(({ address }) => address),
    migrationParams.founders.map(({ tokens }) => web3.utils.toWei(tokens.toString())),
    migrationParams.founders.map(({ reputation }) => web3.utils.toWei(reputation.toString())),
    UController,
    '0'
  ]

  spinner.start('Creating a new organization...')
  const forgeOrg = daoCreator.methods.forgeOrg(
    orgName,
    tokenName,
    tokenSymbol,
    founderAddresses,
    tokenDist,
    repDist,
    uController,
    cap
  )

  const Avatar = await forgeOrg.call()
  tx = await forgeOrg.send()
  await logTx(tx, 'Created new organization.')

  spinner.start('Setting AbsoluteVote parameters...')

  const absoluteVoteSetParams = absoluteVote.methods.setParameters(
    migrationParams.AbsoluteVote.votePerc,
    migrationParams.AbsoluteVote.voteOnBehalf
  )
  const absoluteVoteParams = await absoluteVoteSetParams.call()
  tx = await absoluteVoteSetParams.send()
  await logTx(tx, 'AbsoluteVote parameters set.')

  spinner.start('Setting SchemeRegistrar parameters...')
  const schemeRegistrarSetParams = schemeRegistrar.methods.setParameters(
    absoluteVoteParams,
    absoluteVoteParams,
    AbsoluteVote
  )
  const schemeRegistrarParams = await schemeRegistrarSetParams.call()
  tx = await schemeRegistrarSetParams.send()
  await logTx(tx, 'SchemeRegistrar parameters set.')

  spinner.start('Setting GlobalConstraintRegistrar parameters...')
  const globalConstraintRegistrarSetParams = globalConstraintRegistrar.methods.setParameters(
    absoluteVoteParams,
    AbsoluteVote
  )
  const globalConstraintRegistrarParams = await globalConstraintRegistrarSetParams.call()
  tx = await globalConstraintRegistrarSetParams.send()
  await logTx(tx, 'GlobalConstraintRegistrar parameters set.')

  spinner.start('Setting UpgradeScheme parameters...')
  const upgradeSchemeSetParams = upgradeScheme.methods.setParameters(absoluteVoteParams, AbsoluteVote)
  const upgradeSchemeParams = await upgradeSchemeSetParams.call()
  tx = await upgradeSchemeSetParams.send()
  await logTx(tx, 'UpgradeScheme parameters set.')

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
      0 // activationTime
    ],
    migrationParams.GenesisProtocol.voteOnBehalf
  )
  const genesisProtocolParams = await genesisProtocolSetParams.call()
  tx = await genesisProtocolSetParams.send()
  await logTx(tx, 'GenesisProtocol parameters set.')

  spinner.start("Setting 'ContributionReward' parameters...")
  const contributionRewardSetParams = contributionReward.methods.setParameters(
    web3.utils.toWei(migrationParams.ContributionReward.orgNativeTokenFeeGWei.toString(), 'gwei'),
    genesisProtocolParams,
    GenesisProtocol
  )
  const contributionRewardParams = await contributionRewardSetParams.call()
  tx = await contributionRewardSetParams.send()
  await logTx(tx, 'ContributionReward parameters set.')

  const schemes = [SchemeRegistrar, GlobalConstraintRegistrar, UpgradeScheme, ContributionReward]
  const params = [
    schemeRegistrarParams,
    globalConstraintRegistrarParams,
    upgradeSchemeParams,
    contributionRewardParams
  ]
  const permissions = [
    '0x0000001F' /* all permissions */,
    '0x00000004' /* manage global constraints */,
    '0x0000000A' /* manage schemes + upgrade controller */,
    '0x00000000' /* no permissions */
  ]

  spinner.start('Setting DAO schemes...')
  tx = await daoCreator.methods.setSchemes(Avatar, schemes, params, permissions).send()
  await logTx(tx, 'DAO schemes set.')

  const avatar = new web3.eth.Contract(require('@daostack/arc/build/contracts/Avatar.json').abi, Avatar, opts)

  const DAOToken = await avatar.methods.nativeToken().call()
  const Reputation = await avatar.methods.nativeReputation().call()

  return {
    dao: {
      name: orgName,
      Avatar,
      DAOToken,
      Reputation
    }
  }
}

module.exports = migrateDAO
