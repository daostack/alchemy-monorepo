require("dotenv").config();
const fs = require("fs");
const Web3 = require("web3");
const HDWallet = require("hdwallet-accounts");
const Ganache = require("ganache-cli");

const { mnemonic, total_accounts } = process.env;

const provider = Ganache.provider({
  db_path: "./db",
  mnemonic,
  total_accounts
});
const web3 = new Web3(provider);

const hdwallet = HDWallet(total_accounts, mnemonic);
hdwallet.accounts.forEach(({ privateKey }) => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
});
web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address;

function getMigrationParams() {
  const params = require("./params.json");
  params.ContributionReward.orgNativeTokenFee = web3.utils.toWei(
    params.ContributionReward.orgNativeTokenFee.toString()
  );
  params.GenesisProtocol.daoBountyLimit = web3.utils.toWei(
    params.GenesisProtocol.daoBountyLimit.toString()
  );
  params.GenesisProtocol.minimumStakingFee = web3.utils.toWei(
    params.GenesisProtocol.minimumStakingFee.toString()
  );
  params.GenesisProtocol.thresholdConstA = web3.utils.toWei(
    params.GenesisProtocol.thresholdConstA.toString()
  );
  params.GenesisProtocol.voteOnBehalf = web3.utils.padLeft(
    web3.utils.toHex(params.GenesisProtocol.voteOnBehalf.toString()),
    40
  );

  return params;
}

async function getOpts() {
  return {
    from: web3.eth.defaultAccount,
    gas: (await web3.eth.getBlock("latest")).gasLimit - 100000
  };
}

async function migrateBase() {
  const opts = await getOpts();

  async function deploy(Contract, ...args) {
    const C = new web3.eth.Contract(Contract.abi, undefined, opts);
    const c = await C.deploy({
      data: Contract.bytecode,
      arguments: args
    }).send();
    return c.options.address;
  }

  const DAOToken = await deploy(
    require("@daostack/arc/build/contracts/DAOToken.json"),
    "DAOstack",
    "GEN",
    web3.utils.toWei("100000000")
  );
  const ControllerCreator = await deploy(
    require("@daostack/arc/build/contracts/ControllerCreator.json")
  );
  const DaoCreator = await deploy(
    require("@daostack/arc/build/contracts/DaoCreator.json"),
    ControllerCreator
  );
  const UController = await deploy(
    require("@daostack/arc/build/contracts/UController.json")
  );
  const GenesisProtocol = await deploy(
    require("@daostack/arc/build/contracts/GenesisProtocol.json"),
    DAOToken
  );
  const SchemeRegistrar = await deploy(
    require("@daostack/arc/build/contracts/SchemeRegistrar.json")
  );
  const UpgradeScheme = await deploy(
    require("@daostack/arc/build/contracts/UpgradeScheme.json")
  );
  const GlobalConstraintRegistrar = await deploy(
    require("@daostack/arc/build/contracts/GlobalConstraintRegistrar.json")
  );
  const ContributionReward = await deploy(
    require("@daostack/arc/build/contracts/ContributionReward.json")
  );
  const AbsoluteVote = await deploy(
    require("@daostack/arc/build/contracts/AbsoluteVote.json")
  );
  const QuorumVote = await deploy(
    require("@daostack/arc/build/contracts/QuorumVote.json")
  );
  const SimpleICO = await deploy(
    require("@daostack/arc/build/contracts/SimpleICO.json")
  );
  const TokenCapGC = await deploy(
    require("@daostack/arc/build/contracts/TokenCapGC.json")
  );
  const VestingScheme = await deploy(
    require("@daostack/arc/build/contracts/VestingScheme.json")
  );
  const VoteInOrganizationScheme = await deploy(
    require("@daostack/arc/build/contracts/VoteInOrganizationScheme.json")
  );
  const OrganizationRegister = await deploy(
    require("@daostack/arc/build/contracts/OrganizationRegister.json")
  );

  return {
    DAOToken,
    DaoCreator,
    UController,
    GenesisProtocol,
    SchemeRegistrar,
    UpgradeScheme,
    GlobalConstraintRegistrar,
    ContributionReward,
    AbsoluteVote,
    QuorumVote,
    SimpleICO,
    TokenCapGC,
    VestingScheme,
    VoteInOrganizationScheme,
    OrganizationRegister
  };
}

async function migrateDAO({
  UController,
  DaoCreator,
  SchemeRegistrar,
  GlobalConstraintRegistrar,
  UpgradeScheme,
  ContributionReward,
  GenesisProtocol,
  AbsoluteVote
}) {
  const accounts = web3.eth.accounts.wallet;
  const opts = await getOpts();
  const migrationParams = getMigrationParams();

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
  await forgeOrg.send();

  const absoluteVoteSetParams = absoluteVote.methods.setParameters(
    migrationParams.AbsoluteVote.votePerc,
    migrationParams.AbsoluteVote.ownerVote
  );
  const absoluteVoteParams = await absoluteVoteSetParams.call();
  await absoluteVoteSetParams.send();

  const schemeRegistrarSetParams = schemeRegistrar.methods.setParameters(
    absoluteVoteParams,
    absoluteVoteParams,
    AbsoluteVote
  );
  const schemeRegistrarParams = await schemeRegistrarSetParams.call();
  await schemeRegistrarSetParams.send();

  const globalConstraintRegistrarSetParams = globalConstraintRegistrar.methods.setParameters(
    absoluteVoteParams,
    AbsoluteVote
  );
  const globalConstraintRegistrarParams = await globalConstraintRegistrarSetParams.call();
  await globalConstraintRegistrarSetParams.send();

  const upgradeSchemeSetParams = upgradeScheme.methods.setParameters(
    absoluteVoteParams,
    AbsoluteVote
  );
  const upgradeSchemeParams = await upgradeSchemeSetParams.call();
  await upgradeSchemeSetParams.send();

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
  await genesisProtocolSetParams.send();

  const contributionRewardSetParams = contributionReward.methods.setParameters(
    migrationParams.ContributionReward.orgNativeTokenFee, // orgNativeTokenFee
    genesisProtocolParams,
    GenesisProtocol
  );
  const contributionRewardParams = await contributionRewardSetParams.call();
  await contributionRewardSetParams.send();

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

  await daoCreator.methods
    .setSchemes(Avatar, schemes, params, permissions)
    .send();

  const avatar = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/Avatar.json").abi,
    Avatar,
    opts
  );

  const NativeToken = await avatar.methods.nativeToken().call();
  const NativeReputation = await avatar.methods.nativeReputation().call();

  return {
    name: orgName,
    Avatar,
    NativeToken,
    NativeReputation
  };
}

async function build() {
  const base = await migrateBase();
  const DAO = await migrateDAO(base);
  fs.writeFileSync(
    "migration.json",
    JSON.stringify(
      {
        mnemonic,
        total_accounts,
        addresses: base,
        DAO
      },
      undefined,
      2
    ),
    "utf-8"
  );
}

build();
