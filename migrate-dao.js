const { getOpts, migrateWithStats, getMigrationParams } = require("./util");
const ora = require("ora");
const fs = require("fs");
const Confirm = require("prompt-confirm");

async function migrateDAO(web3, addresses) {
  const accounts = web3.eth.accounts.wallet;
  const opts = await getOpts(web3);
  const migrationParams = getMigrationParams(web3);

  const confirmation = await new Confirm(
    "About to migrate new DAO. Continue?"
  ).run();
  if (!confirmation) {
    throw new Error("Canceled by the user");
  }

  const spinner = ora();
  spinner.start("Migrating DAO...");
  let base, tx;
  try {
    base = addresses || require("./base.json");
  } catch (e) {
    spinner.fail(
      `Could not load base addresses, please run 'npm run migrate:base' before migrating a DAO.`
    );
  }

  const {
    UController,
    DaoCreator,
    SchemeRegistrar,
    GlobalConstraintRegistrar,
    UpgradeScheme,
    ContributionReward,
    GenesisProtocol,
    AbsoluteVote
  } = base;

  const daoCreator = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/DaoCreator.json").abi,
    DaoCreator,
    opts
  );
  const schemeRegistrar = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/SchemeRegistrar.json").abi,
    SchemeRegistrar,
    opts
  );
  const globalConstraintRegistrar = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/GlobalConstraintRegistrar.json").abi,
    GlobalConstraintRegistrar,
    opts
  );
  const upgradeScheme = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/UpgradeScheme.json").abi,
    UpgradeScheme,
    opts
  );
  const contributionReward = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/ContributionReward.json").abi,
    ContributionReward,
    opts
  );
  const genesisProtocol = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/GenesisProtocol.json").abi,
    GenesisProtocol,
    opts
  );
  const absoluteVote = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/AbsoluteVote.json").abi,
    AbsoluteVote,
    opts
  );

  const founders = [
    accounts[0].address,
    accounts[1].address,
    accounts[2].address,
    accounts[3].address,
    accounts[4].address
  ];
  const [
    orgName,
    tokenName,
    tokenSymbol,
    tokenDist,
    repDist,
    uController,
    cap
  ] = [
    "Genesis Test",
    "Genesis Test",
    "GDT",
    founders.map(_ => "1000"),
    founders.map(_ => "1000"),
    UController,
    "0"
  ];

  spinner.start("Creating a new organization...");
  const forgeOrg = await daoCreator.methods.forgeOrg(
    orgName,
    tokenName,
    tokenSymbol,
    founders,
    tokenDist,
    repDist,
    uController,
    cap
  );
  const Avatar = await forgeOrg.call();
  tx = await forgeOrg.send();
  spinner.succeed(`txHash: ${tx.transactionHash} | Created new organization.`);

  spinner.start("Setting AbsoluteVote parameters...");
  const absoluteVoteSetParams = absoluteVote.methods.setParameters(
    migrationParams.AbsoluteVote.votePerc,
    migrationParams.AbsoluteVote.ownerVote
  );
  const absoluteVoteParams = await absoluteVoteSetParams.call();
  tx = await absoluteVoteSetParams.send();
  spinner.succeed(
    `txHash: ${tx.transactionHash} | AbsoluteVote parameters set.`
  );

  spinner.start("Setting SchemeRegistrar parameters...");
  const schemeRegistrarSetParams = schemeRegistrar.methods.setParameters(
    absoluteVoteParams,
    absoluteVoteParams,
    AbsoluteVote
  );
  const schemeRegistrarParams = await schemeRegistrarSetParams.call();
  tx = await schemeRegistrarSetParams.send();
  spinner.succeed(
    `txHash: ${tx.transactionHash} | SchemeRegistrar parameters set.`
  );

  spinner.start("Setting GlobalConstraintRegistrar parameters...");
  const globalConstraintRegistrarSetParams = globalConstraintRegistrar.methods.setParameters(
    absoluteVoteParams,
    AbsoluteVote
  );
  const globalConstraintRegistrarParams = await globalConstraintRegistrarSetParams.call();
  tx = await globalConstraintRegistrarSetParams.send();
  spinner.succeed(
    `txHash: ${tx.transactionHash} | GlobalConstraintRegistrar parameters set.`
  );

  spinner.start("Setting UpgradeScheme parameters...");
  const upgradeSchemeSetParams = upgradeScheme.methods.setParameters(
    absoluteVoteParams,
    AbsoluteVote
  );
  const upgradeSchemeParams = await upgradeSchemeSetParams.call();
  tx = await upgradeSchemeSetParams.send();
  spinner.succeed(
    `txHash: ${tx.transactionHash} | UpgradeScheme parameters set.`
  );

  spinner.start("Setting GenesisProtocol parameters...");
  const genesisProtocolSetParams = genesisProtocol.methods.setParameters(
    [
      migrationParams.GenesisProtocol.preBoostedVoteRequiredPercentage,
      migrationParams.GenesisProtocol.preBoostedVotePeriodLimit,
      migrationParams.GenesisProtocol.boostedVotePeriodLimit,
      migrationParams.GenesisProtocol.thresholdConstA,
      migrationParams.GenesisProtocol.thresholdConstB,
      migrationParams.GenesisProtocol.minimumStakingFee,
      migrationParams.GenesisProtocol.quietEndingPeriod,
      migrationParams.GenesisProtocol.proposingRepRewardConstA,
      migrationParams.GenesisProtocol.proposingRepRewardConstB,
      migrationParams.GenesisProtocol.stakerFeeRatioForVoters,
      migrationParams.GenesisProtocol.votersReputationLossRatio,
      migrationParams.GenesisProtocol.votersGainRepRatioFromLostRep,
      migrationParams.GenesisProtocol.daoBountyConst,
      migrationParams.GenesisProtocol.daoBountyLimit
    ],
    migrationParams.GenesisProtocol.voteOnBehalf
  );
  const genesisProtocolParams = await genesisProtocolSetParams.call();
  tx = await genesisProtocolSetParams.send();
  spinner.succeed(
    `txHash: ${tx.transactionHash} | GenesisProtocol parameters set.`
  );

  spinner.start("Setting 'ContributionReward' parameters...");
  const contributionRewardSetParams = contributionReward.methods.setParameters(
    migrationParams.ContributionReward.orgNativeTokenFee, // orgNativeTokenFee
    genesisProtocolParams,
    GenesisProtocol
  );
  const contributionRewardParams = await contributionRewardSetParams.call();
  tx = await contributionRewardSetParams.send();
  spinner.succeed(
    `txHash: ${tx.transactionHash} | ContributionReward parameters set.`
  );

  const schemes = [
    SchemeRegistrar,
    GlobalConstraintRegistrar,
    UpgradeScheme,
    ContributionReward
  ];
  const params = [
    schemeRegistrarParams,
    globalConstraintRegistrarParams,
    upgradeSchemeParams,
    contributionRewardParams
  ];
  const permissions = [
    "0x0000001F" /* all permissions */,
    "0x00000004" /* manage global constraints */,
    "0x0000000A" /* manage schemes + upgrade controller */,
    "0x00000000" /* no permissions */
  ];

  spinner.start("Setting DAO schemes...");
  tx = await daoCreator.methods
    .setSchemes(Avatar, schemes, params, permissions)
    .send();
  spinner.succeed(`DAO schemes set.`);

  const avatar = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/Avatar.json").abi,
    Avatar,
    opts
  );

  const NativeToken = await avatar.methods.nativeToken().call();
  const NativeReputation = await avatar.methods.nativeReputation().call();

  const dao = {
    name: orgName,
    Avatar,
    NativeToken,
    NativeReputation
  };

  fs.writeFileSync("./dao.json", JSON.stringify(dao, undefined, 2), "utf-8");
  spinner.succeed(
    `Wrote result to 'dao.json': ${JSON.stringify(dao, undefined, 2)}`
  );

  return dao;
}

if (require.main == module) {
  migrateWithStats(migrateDAO);
} else {
  module.exports = migrateDAO;
}
