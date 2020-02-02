[![npm (scoped)](https://img.shields.io/npm/v/@daostack/migration.svg)](https://www.npmjs.com/package/@daostack/migration)
[![Docker Pulls](https://img.shields.io/docker/pulls/daostack/migration.svg)](https://hub.docker.com/r/daostack/migration/)
[![Build Status](https://travis-ci.com/daostack/migration.svg?token=aXt9zApRNkfx8zDMypWx&branch=master)](https://travis-ci.com/daostack/migration)

# DAOstack Migration

A repo for handling the migration of DAOstack contracts and DAOs. This repo is packaged both as an
[npm package](https://www.npmjs.com/package/@daostack/migration) and a
[Docker image](https://hub.docker.com/r/daostack/migration/) that exposes a pre-migrated ganache instance and other
utilities related to migration.

Migration is separated into two phases:

1. Base migration - of universal contracts from the [`@daostack/arc`](https://www.npmjs.com/package/@daostack/arc)
   package.
2. DAO migration - of an [example DAO](#The_Example_DAO).

#### Versioning

Both the npm package and the docker image are versioned according to the `@daostack/arc` package and the migration
version. Example: `@daostack/arc@<arc version>` -> npm: `@daostack/ganache@<arcversion>-v<migration version>` and
dockerhub: `daostack/ganache:X.Y.Z-v<migration version>`

## Usage

### As a library

1. `npm install --save @daostack/migration`
2.

```javascript
const DAOstackMigration = require('@daostack/migration');

// ganache-core object with already migrated contracts
// options are as specified in https://github.com/trufflesuite/ganache-cli#library
DAOstackMigration.Ganache.server(..);
DAOstackMigration.Ganache.provider(..);
// choose the network to get addressed for. Either private (ganache), kovan, rinkeby, mainnet.
let network = 'private'
// migration result object for ganache
DAOstackMigration.migration(network);

const options = {
  // arc version
  arcVersion: '0.0.1-rc.32',
  // web3 provider url
  provider: 'http://localhost:8545',
  // gas price in GWei. If not specified, will use an automatically suggested price.
  gasPrice: 3.4,
  // suppress console output
  quiet: true,
  // disable confirmation messages
  disable-confs: true,
  // force deploy everything
  force: true,
  // delete previous deployment state and starts with clean state
  restart: false,
  // filepath to output the migration results
  output: 'migration.json',
  // private key of the account used in migration (overrides the 'mnemonic' option)
  privateKey: '0x123...',
  // mnemonic used to generate the private key of the account used in migration
	mnemonic: 'one two three ...',
	// migration parameters
	params: {
		default: {
			// migration params as defined in the "Migration parameters" section below
		},
		private: {
			// override defaults on private network
		},
		kovan: {
			// override defaults on kovan
		},
	},
};

// migrate base contracts
const migrationBaseResult = await DAOstackMigration.migrateBase(options);
migrationBaseResult.base.GenesisProtocol // migrated genesis protocol address
// migrate an example DAO (requires an existing `output` file with a base migration)
const migrationDAOResult = await DAOstackMigration.migrateDAO(options);
migrationDAOResult.dao.Avatar // DAO avatar address
// migrate an demo test scenario (requires an existing `output` file with a base migration)
const migrationDemoResult = await DAOstackMigration.migrateDemoTest(options);
migrationDemoResult.test.Avatar // Test DAO avatar address
// migrate base, example DAO and demo test contracts
const migrationResult = await DAOstackMigration.migrate(options); // migrate

// run the cli
DAOstackMigration.cli()
```

### As a CLI

1. `npm install --global @daostack/migration`

_Note: if you encounter an issue which contains this error message `EACCES: permission denied, mkdir` please follow [this guide](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) and try again_

Usage:

```
Migrate base contracts and an example DAO

Commands:
  daostack-migrate             Migrate base contracts and an example DAO                                             [default]
  daostack-migrate base        Migrate base contracts
  daostack-migrate dao         Migrate an example DAO
  daostack-migrate completion  generate bash completion script

Options:
  --version          Show version number                                                                       [boolean]
  --arc-version, -a  Use a specific Arc package version                                       [string] [default: latest supported version]
  --provider, -p     web3 provider url                                       [string] [default: "http://localhost:8545"]
  --gas-price, -g    gas price in GWei. If not specified, will use an automatically suggested price.            [number]
  --quiet, -q        suppress console output                                                  [boolean] [default: false]
  --force, -f        disable confirmation messages                                            [boolean] [default: false]
  --restart, -t      delete previous deployment state and starts with clean state restart     [boolean] [default: false]
  --output, -o       filepath to output the migration results                       [string] [default: "migration.json"]
  --params, -i       path to the file containing the migration parameters           [string] [default: "migration-params.json"]
  --private-key, -s  private key of the account used in migration (cannot be used with the 'mnemonic' option)
                                [string] [default: "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"]
  --mnemonic, -m     mnemonic used to generate the private key of the account used in migration (cannot be used with the
                     'private-key' option)                                                                      [string]
  --help             Show help                                                                                 [boolean]
```

### How to deploying a new DAO:

#### From CLI:

1. Make sure you have Node.js and NPM installed and updated to a version later than 10.15.3 and 6.0.0 respectively. You can find instructions for installation [here](https://nodejs.org/en/download/), and then verify your version by opening your CMD/ Terminal and type: `node -v` and then `npm -v`.

2. In your terminal, use this command to install the DAOstack migration CLI: `npm install --global @daostack/migration`.

3. Create a new `your-new-dao-params.json` file, you can also use the same [`migration-params.json`](https://github.com/daostack/migration/blob/master/migration-params.json) from the DAOstack migratio GitHub repo.

4. Customize `your-new-dao-params.json` by setting up the DAO name, token, founders, schemes etc. To learn more about the customization options for the parameters please see the [Migration parameters](#migration-parameters) section below.

5. Obtain a URL of an Ethereum node connected to your desired network. You can also use [Infura](https://infura.io) for that.

6. Get some ether in your Ethereum account to pay for the mining fee of deploying the DAO. Make sure you have the private key for the account.

7. In the terminal window, use this command to deploy your DAO:
   `daostack-migrate dao --params <YOUR_PARAMS_FILE_LOCATION> --gasPrice <YOUR_DESIRED_VALUE> --provider <YOUR_ETHERUM_NODE> --private-key <YOUR_PRIVATE_KEY>`.
   _Note: You can also use a mnemonic seed instead of a private key by replacing the `--private-key` option with `--mnemonic <YOUR_MNEMONIC>`._

8. This will deploy the DAO for you and output the addresses into a `migration.json` file.

#### From Javascript

```javascript
const DAOstackMigration = require('@daostack/migration');

const options = {
  // arc version
  arcVersion: '0.0.1-rc.32',
  // web3 provider url
  provider: 'http://localhost:8545',
  // gas price in GWei. If not specified, will use an automatically suggested price.
  gasPrice: 3.4,
  // surpress console output
  quiet: true,
  // disable confirmation messages
  force: true,
  // delete previous deployment state and starts with clean state
  restart: false,
  // filepath to output the migration results
  output: 'migration.json',
  // private key of the account used in migration (overrides the 'mnemonic' option)
  privateKey: '0x123...',
  // mnemonic used to generate the private key of the account used in migration
  mnemonic: 'one two three ...',
  // migration parameters
  params: {
    default: {
      // migration params as defined in the "Migration parameters" section below
    },
    private: {
      // override defaults on private network
    },
    kovan: {
      // override defaults on kovan
    }
  }
};

const migrationDAOResult = await DAOstackMigration.migrateDAO(options);
migrationDAOResult.dao.Avatar; // DAO avatar address
// migrate an demo test scenario (requires an existing `output` file with a base migration)
const migrationDemoResult = await DAOstackMigration.migrateDemoTest(options);
migrationDemoResult.test.Avatar; // Test DAO avatar address
// migrate base, example DAO and demo test contracts
const migrationResult = await DAOstackMigration.migrate(options); // migrate

// run the cli
DAOstackMigration.cli();
```

### As a docker image

1. `docker pull daostack/migration`
2. Run: `docker run --rm --name=ganache daostack/migration:0.0.0-alpha.56-v7 <ganache-cli arguments>`
3. Fetch migration result file: `docker exec ganache cat migration.json`
4. Fetch migration params file: `docker exec ganache cat migration-params.json`

## Migration result

Example migration result object:

```json
{
  "base": {
    "DAOToken": "0x123...",
    "ControllerCreator": "0x123...",
    "DaoCreator": "0x123...",
    "UController": "0x123...",
    "GenesisProtocol": "0x123...",
    "SchemeRegistrar": "0x123...",
    "UpgradeScheme": "0x123...",
    "GlobalConstraintRegistrar": "0x123...",
    "ContributionReward": "0x123...",
    "AbsoluteVote": "0x123...",
    "QuorumVote": "0x123...",
    "TokenCapGC": "0x123...",
    "VestingScheme": "0x123...",
    "VoteInOrganizationScheme": "0x123...",
    "OrganizationRegister": "0x123...",
    "Redeemer": "0x123..."
  },
  "dao": {
    "name": "DAO Jones",
    "Avatar": "0x123...",
    "NativeToken": "0x123...",
    "NativeReputation": "0x123..."
  },
  "test": {
    "name": "0x123...",
    "Avatar": "0x123...",
    "NativeToken": "0x123...",
    "NativeReputation": "0x123...",
    "proposalId": "0xabc..."
  }
}
```

## Migration parameters

Example migration parameters object:

```js
{
  "orgName": "The DAO", // Sets the name of your DAO
  "tokenName": "The DAO Token", // Sets the name of your DAO token
  "tokenSymbol": "TDT", // Sets the name of your DAO token symbol

  // Needed only if you would like to use Contribution Reward scheme in your DAO
  "ContributionReward": [{
    "voteParams": 0 // The index of the parameters in the voting machines parameters array
  }],
  // Needed only if you would like to use Generic Scheme scheme in your DAO
  "GenericScheme": [{
    // The address of the contract the Generic Scheme can call.
    "targetContract": "0x0000000000000000000000000000000000000000"
    "votingMachine": "0x00000000000000000000votingmachineaddress" // The address of your voting machine (default is Genesis Protocol address)
    "voteParams": 1 // The index of the parameters in the voting machines parameters array (default is 0)
  }],
  // Allow you to deploy and call any contract you might need during the migration
  "StandAloneContracts":[
     {
      "name": "Reputation",
      // If the contract isnot from Arc you must have the contract data (ABI + Bytecode) as a JSON file with the same name as the scheme
      "fromArc": true,
      // Add here any calls to the contract you want to execute
      "runFunctions": [
            {
               "functionName": "transferOwnership",
               "params": [
                  "AvatarAddress"
               ]
            }
         ]
     },
     {
      "name": "RepAllocation",
      // If your contract has an initialize / constructor method which accepts arguments please add them here.
      // unset constructor if using initialize
      "constructor": false,
      "params": [
        100000,
        { "StandAloneContract": 0 }
      ],
      "fromArc": true,
      // Optional. Allows to use a specific Arc version for the StandAloneContract contract, default: Arc version of the DAO.
      "arcVersion": "0.0.1-rc.30"
     }
  ],

  // Allows you to register and deploy custom schemes
  "CustomSchemes": {
     // You should have an contract build file with identical name inside `custom-abis` folder
    "MyCustomScheme": [
      {
        // If true will call setParameters() else will call initialized() with the avatar address as a first parameter
        "isUniversal": true,
        // Parameters to use in the setParameters() / initialized() method
        "params": [
          // An object like this { "voteParams": X } is transformed as the voting params hash like "voteParams": 0 in the supported schemes
          { "voteParams": 0 },
          // This will be converted to the actual Genesis Protocol address
          "GenesisProtocolAddress",
          // You can also add literal parameters like so
          "anotherParam"
        ],
        // If the scheme is deployed set the address here, if not remove the field and the script will deploy the scheme
        // Can also use an address from the Standalone contracts like so: "address": { "StandAloneContract": 0 }
        "address": "0xaddress...",
        // The permissions your scheme need from the controller
        "permissions": "0x00000001",
        // Optional. Allows to use a specific Arc version for the CustomScheme contract, default: Arc version of the DAO.
        "arcVersion": "0.0.1-rc.30"
      },
      {
        "name": "ContinuousLocking4Reputation",
        "schemeName": "ContinuousLocking4Reputation",
        "isUniversal": false,
        "params": [
          "CONTINUES_LOCKING_REP_ALLOCATION", // How much Reputation should the scheme allocate.
          "START_TIME", // Start time for the locking as UNIX Timestamp (in seconds).
          "BATCH_TIME", // Time per batch (in seconds)
          "REDEEM_TIME", // Start time for redeeming as UNIX Timestamp (in seconds).
          "BATCHES_COUNT", // Number of batches
          "REP_REWARD_CONST_A", // repRewardConstA
          "REP_REWARD_CONST_B", // repRewardConstB
          "BATCHES_INDEX_CAP", // batchesIndexCap
          "TOKEN_ADDRESS", // Address of the token to lock.
          "AGREEMENT_HASH" // IPFS hash of user agreement. Can be arbitrary (for example: "0x1000000000000000000000000000000000000000000000000000000000000000") if not used.
        ],
        "permissions": "0x00000010",
        "alias": "InfiniteReputation4Token",
        "fromArc": true
      }
    ]
  },
  // Parameters list your DAO will use with the voting machines
  // You can add here either Genesis Protocol parameters which will set the parameters in the GP voting machine or add a pre-set parameters hash to any voting machine
  "VotingMachinesParams": [
      {
      "boostedVotePeriodLimit": 600,
      "daoBountyConst": 10,
      "minimumDaoBounty": 100,
      "queuedVotePeriodLimit": 1800,
      "queuedVoteRequiredPercentage": 50,
      "preBoostedVotePeriodLimit": 600,
      "proposingRepReward": 5,
      "quietEndingPeriod": 300,
      "thresholdConst": 2000,
      "voteOnBehalf": "0x0000000000000000000000000000000000000000",
      "votersReputationLossRatio": 1,
      "activationTime": 0
    },
    {
      "votingParamsHash": "0x000000000000000000000000000000paramshash" // If you want to use a different voting machine params you can set the parameters hash here
    }
  ],
  // Select the schemes you would like your DAO to have
  "schemes": {
    "ContributionReward": true,
    "GenericScheme": false,
    "SchemeRegistrar": true,
    "GlobalConstraintRegistrar": true,
    "UpgradeScheme": true
  },
  // If true, the permission of the account which was used to deploy the DAO will
  // be revoked at the end of the deployment process
  "unregisterOwner": true,
  // True if should use Universal Controller (default false).
  "useUController": false,
  // True if should use the DAO Creator to deploy the DAO (default false).
  "useDaoCreator": false,
  // If not using DaoCreator, set to true to prevent automatic tracking on DAOTracker, otherwise the DAO will be tracked as part of the script
  "noTrack": false,
  // Allows to specify which Arc version should be used to deploy the dao.
  // This will override the version specified in the CLI flag.
  "arcVersion": "0.0.1-rc.30",
  // List of addresses to mint initial tokens and reputation to
  "founders": [
    {
      "address": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
      "tokens": 1000,
      "reputation": 1000
    },
    {
      "address": "0xffcf8fdee72ac11b5c542428b35eef5769c409f0",
      "tokens": 1000,
      "reputation": 1000
    },
    {
      "address": "0x22d491bde2303f2f43325b2108d26f1eaba1e32b",
      "tokens": 1000,
      "reputation": 1000
    },
    {
      "address": "0xe11ba2b4d45eaed5996cd0823791e0c93114882d",
      "tokens": 1000,
      "reputation": 1000
    },
    {
      "address": "0xd03ea8624c8c5987235048901fb614fdca89b117",
      "tokens": 1000,
      "reputation": 1000
    },
    {
      "address": "0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc",
      "tokens": 1000,
      "reputation": 1000
    }
  ]
}
```

## Develop

1. `git clone https://github.com/daostack/migration.git && cd migration`
2. `npm install`
3. Install [`Docker`](https://docs.docker.com/install/linux/docker-ce/ubuntu/) and
   [`jq`](https://stedolan.github.io/jq/)

### Commands

- `cleandb` - rm the existing local db.
- `ganache` - run a ganache instance with local db.
- `migrate ...` - run migration (same arguments as cli)
- `docker:build` - build the docker image from current directory (make sure all to migrate on a fresh ganache
  beforehand)
- `docker:push` - push docker image to DockerHub.
- `release ...` - fully release a version (requires an `.env` file with `kovan_provider` and `kovan_private_key`
  variables set) (same arguments as cli)

### How to release a version?

In order to release a version:

1. In one terminal tab:

   1. `npm run cleandb` - Clean any existing ganache DB.
   2. `npm run ganache` - Run a ganache, creating a fresh DB.

2. In the another terminal tab:

   1. Make sure you have the required `.env` variables set (`kovan_provider`, `kovan_private_key`, `rinkeby_provider`,
      `rinkeby_private_key`, `mainnet_provider`, `mainnet_private_key`). It should look something like this:

      ```bash
      kovan_provider="https://kovan.infura.io/v3/<YOUR_INFURA_KEY>"
      kovan_private_key="0x<YOUR_PRIVATE_KEY>"
      rinkeby_provider="https://rinkeby.infura.io/v3/<YOUR_INFURA_KEY>"
      rinkeby_private_key="0x<YOUR_PRIVATE_KEY>"
      mainnet_provider="https://mainnet.infura.io/v3/<YOUR_INFURA_KEY>"
      mainnet_private_key="0x<YOUR_PRIVATE_KEY>"
      xdai_provider="https://poa.api.nodesmith.io/v1/dai/jsonrpc?apiKey=<YOUR_XDAI_KEY>"
      xdai_private_key="0x<YOUR_PRIVATE_KEY>"
      sokol_provider="https://sokol.poa.network"
      sokol_private_key="0x<YOUR_PRIVATE_KEY>"
      ```

      _Note: Make sure you have enough ETH(or xDAI for the case of xDai/ SPOA in the case of Sokol) in the account corresponding to the private key you will use to pay the deployment gas costs._

   2. Make sure you are not on the `master` branch. If needed, create a new branch for the release process.
   3. `npm run prepare-release` - This will perform all the necessary steps to update version and prepare for a new release. The changes made here will be committed to the git branch.
   4. Create a PR and merge the new branch with the changes into `master`.
   5. Make sure that you have a Dockerhub ID with permission to push an image to the `daostack` organization.
   6. Make sure that you have an `npm` account with permission to push an image to the `daostack` organization.
   7. Make sure to be on the `master` branch and run `npm run release` - this will publish the new version to NPM and Dockerhub.
