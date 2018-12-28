async function assignGlobalVariables (web3, spinner, opts, logTx, base) {
  this.web3 = web3
  this.spinner = spinner
  this.opts = opts
  this.logTx = logTx
  this.base = base
}

async function migrateDemoTest ({ web3, spinner, confirm, opts, migrationParams, logTx, previousMigration: { base } }) {
  if (!(await confirm('About to migrate new Demo Test. Continue?'))) {
    return
  }

  assignGlobalVariables(web3, spinner, opts, logTx, base)

  if (!base) {
    const msg = `Couldn't find existing base migration ('migration.json' > 'base').`
    this.spinner.fail(msg)
    throw new Error(msg)
  }

  this.spinner.start('Migrating Demo Test...')

  let accounts = this.web3.eth.accounts.wallet

  if (accounts[1] === undefined) {
    this.web3.eth.accounts.wallet.add(this.web3.eth.accounts.privateKeyToAccount(
      '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1'
    ))
    this.web3.eth.accounts.wallet.add(this.web3.eth.accounts.privateKeyToAccount(
      '0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c'
    ))
    accounts = this.web3.eth.accounts.wallet
  }

  const externalTokenAddress = await migrateExternalToken()

  const [orgName, tokenName, tokenSymbol, founders, tokenDist, repDist, cap] = [
    'Genesis Test',
    'Genesis Test',
    'GDT',
    migrationParams.founders.map(({ address }) => address),
    migrationParams.founders.map(({ tokens }) => tokens),
    migrationParams.founders.map(({ reputation }) => reputation),
    '0'
  ]

  const avatarAddress = await migrateDemoDao(orgName, tokenName, tokenSymbol, founders, tokenDist, repDist, cap)

  const gpParamsHash = await setGenesisProtocolParams()

  const crParamsHash = await setContributionRewardParams(gpParamsHash) // FIXME

  const schemes = [
    {
      address: this.base.ContributionReward,
      params: crParamsHash,
      permissions: '0x00000000' /* no special params */
    }
  ]

  await setSchemes(schemes, avatarAddress)

  const [PASS, FAIL] = [1, 2]

  const proposalId = await submitProposal({
    avatarAddress: avatarAddress,
    descHash: '0x000000000000000000000000000000000000000000000000000000000000abcd',
    rep: 10,
    tokens: 10,
    eth: 10,
    external: 10,
    periodLength: 0,
    periods: 1,
    beneficiary: accounts[1].address,
    externalTokenAddress: externalTokenAddress
  })

  await voteOnProposal({
    proposalId: proposalId,
    outcome: FAIL,
    voter: accounts[2].address
  })

  await voteOnProposal({
    proposalId: proposalId,
    outcome: PASS,
    voter: accounts[1].address
  })

  const avatar = new this.web3.eth.Contract(
    require('@daostack/arc/build/contracts/Avatar.json').abi,
    avatarAddress,
    this.opts
  )

  const Avatar = avatarAddress
  const NativeToken = await avatar.methods.nativeToken().call()
  const NativeReputation = await avatar.methods.nativeReputation().call()

  return {
    test: {
      name: orgName,
      Avatar,
      NativeToken,
      NativeReputation,
      proposalId
    }
  }
}

async function migrateExternalToken () {
  this.spinner.start('Migrating External Token...')

  const externalToken = await new this.web3.eth.Contract(
    require('@daostack/arc/build/contracts/DAOToken.json').abi,
    undefined,
    this.opts
  ).deploy({
    data: require('@daostack/arc/build/contracts/DAOToken.json').bytecode,
    arguments: ['External', 'EXT', 0]
  }).send()

  return externalToken.options.address
}

async function migrateDemoDao (orgName, tokenName, tokenSymbol, founders, tokenDist, repDist, cap) {
  this.spinner.start('Creating a new organization...')

  const {
    UController,
    DaoCreator
  } = this.base

  let tx

  const daoCreator = new this.web3.eth.Contract(
    require('@daostack/arc/build/contracts/DaoCreator.json').abi,
    DaoCreator,
    this.opts
  )

  const forge = daoCreator.methods.forgeOrg(
    orgName,
    tokenName,
    tokenSymbol,
    founders,
    tokenDist,
    repDist,
    UController,
    cap
  )

  const avatarAddress = await forge.call()
  tx = await forge.send()
  await this.logTx(tx, 'Created new organization.')

  return avatarAddress
}

async function setContributionRewardParams (gpParamsHash) {
  this.spinner.start('Setting Contribution Reward Parameters...')

  const {
    ContributionReward,
    GenesisProtocol
  } = this.base

  let tx

  const contributionReward = new this.web3.eth.Contract(
    require('@daostack/arc/build/contracts/ContributionReward.json').abi,
    ContributionReward,
    this.opts
  )

  const crParams = {
    orgNativeTokenFeeGWei: 0
  }

  const crSetParams = contributionReward.methods.setParameters(
    this.web3.utils.toWei(crParams.orgNativeTokenFeeGWei.toString(), 'gwei'),
    gpParamsHash,
    GenesisProtocol
  )

  const crParamsHash = await crSetParams.call()
  tx = await crSetParams.send()
  await this.logTx(tx, 'Contribution Reward Set Parameters.')

  return crParamsHash
}

async function setGenesisProtocolParams () {
  this.spinner.start('Setting Genesis Protocol Parameters...')

  const {
    GenesisProtocol
  } = this.base

  let tx

  const genesisProtocol = new this.web3.eth.Contract(
    require('@daostack/arc/build/contracts/GenesisProtocol.json').abi,
    GenesisProtocol,
    this.opts
  )

  const gpParams = {
    boostedVotePeriodLimit: 259200,
    daoBountyConst: 75,
    minimumDaoBountyGWei: 100,
    queuedVotePeriodLimit: 1814400,
    queuedVoteRequiredPercentage: 50,
    preBoostedVotePeriodLimit: 259200,
    proposingRepRewardGwei: 5,
    quietEndingPeriod: 86400,
    thresholdConst: 2000,
    voteOnBehalf: '0x0000000000000000000000000000000000000000',
    votersReputationLossRatio: 1
  }

  const gpSetParams = genesisProtocol.methods.setParameters(
    [
      gpParams.queuedVoteRequiredPercentage,
      gpParams.queuedVotePeriodLimit,
      gpParams.boostedVotePeriodLimit,
      gpParams.preBoostedVotePeriodLimit,
      gpParams.thresholdConst,
      gpParams.quietEndingPeriod,
      web3.utils.toWei(gpParams.proposingRepRewardGwei.toString(), 'gwei'),
      gpParams.votersReputationLossRatio,
      web3.utils.toWei(gpParams.minimumDaoBountyGWei.toString(), 'gwei'),
      gpParams.daoBountyConst,
      0 // activationTime
    ],
    gpParams.voteOnBehalf
  )

  const gpParamsHash = await gpSetParams.call()

  tx = await gpSetParams.send()
  await this.logTx(tx, 'Genesis Protocol Set Parameters.')

  return gpParamsHash
}

async function setSchemes (schemes, avatarAddress) {
  this.spinner.start('Registering Schemes to DAO...')

  const {
    DaoCreator
  } = this.base

  let tx

  const daoCreator = new this.web3.eth.Contract(
    require('@daostack/arc/build/contracts/DaoCreator.json').abi,
    DaoCreator,
    this.opts
  )

  tx = await daoCreator.methods.setSchemes(
    avatarAddress,
    schemes.map(({ address }) => address),
    schemes.map(({ params }) => params),
    schemes.map(({ permissions }) => permissions)
  ).send()

  await this.logTx(tx, 'Dao Creator Set Schemes.')
}

async function submitProposal ({
  avatarAddress,
  descHash,
  rep,
  tokens,
  eth,
  external,
  periodLength,
  periods,
  beneficiary,
  externalTokenAddress
}) {
  this.spinner.start('Submitting a new Proposal...')

  const {
    ContributionReward
  } = this.base

  let tx

  const contributionReward = new this.web3.eth.Contract(
    require('@daostack/arc/build/contracts/ContributionReward.json').abi,
    ContributionReward,
    this.opts
  )

  const prop = contributionReward.methods.proposeContributionReward(
    avatarAddress,
    descHash,
    rep,
    [tokens, eth, external, periodLength, periods],
    externalTokenAddress,
    beneficiary
  )

  const proposalId = await prop.call()
  tx = await prop.send()
  await this.logTx(tx, 'Submit new Proposal.')

  return proposalId
}

async function voteOnProposal ({ proposalId, outcome, voter }) {
  this.spinner.start('Voting on proposal...')

  const {
    GenesisProtocol
  } = this.base

  let tx

  const genesisProtocol = new this.web3.eth.Contract(
    require('@daostack/arc/build/contracts/GenesisProtocol.json').abi,
    GenesisProtocol,
    this.opts
  )

  tx = await genesisProtocol.methods
    .vote(proposalId, outcome, 0, voter)
    .send({ from: voter })

  await this.logTx(tx, 'Voted on Proposal.')
}

module.exports = migrateDemoTest
