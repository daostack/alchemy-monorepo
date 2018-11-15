# DAOstack Migration

Migration scripts and a ganache with all DAOstack contracts and an example DAO already migrated.
This repo is exposed both as an npm package, a CLI and a docker container which you can use as a drop-in replacement for [`ganache-cli`](https://github.com/trufflesuite/ganache-cli#using-ganache-cli).

## Commands

1. `ganache` - start a local Ganache process.
2. `migrate:base` - migrate base contracts.
3. `migrate:dao` - migrate DAO.
4. `migrate` - migrate base contracts & DAO.
5. `build:docker` - build the `daostack/ganache` docker image.
6. `publish:docker` - push the `daostack/ganache` image to [DockerHub](https://hub.docker.com/).

## Configuration

### Package config

Configration related to the migration process lives in the `config` section in `package.json`.
You can override it locally using `npm config set @daostack/ganache:<key> <value>`
Available configurable parameters:

- `mnemonic` - the mnemonic used to generate accounts.
- `total_accounts` - the number of accounts to generate.
- `provider` - the web3 provider to be used.
- `gasPriceGWei` - the gas price in GWei units to use in transactions.

Example: `npm config set @daostack/ganache:provider https://kovan.infura.io/v3/<infura key>` - run on kovan using infura.

### `params.json`

Configuration related to specific contract params can be configured in `params.json`.

**Note: This file also includes the `migrationVersion` which must be incremented before publishing a new version.**

## Versioning

Both the npm package and the docker image are versioned according to the `@daostack/arc` package and the migration version.
Example: `@daostack/arc@<arc version>` -> npm: `@daostack/ganache@<arcversion>-v<migration version>` and dockerhub: `daostack/ganache:X.Y.Z-v<migration version>`

## Use the docker image

1. `docker pull daostack/ganache`
2. `docker run daostack/ganache ...` - use arguments as specified in `ganache-cli`

## Use as a library

1. `npm install @daostack/ganache`
2. `const Ganache = require('@daostack/ganache') // instead of: require('ganache-cli')` - use as a drop-in replacement for the `ganache-cli` library.

The library also exposes the two migration scripts `migrateBase` & `migrateDAO`:

```javascript
const { migrateBase, migrateDAO } = require("@daostack/ganache");
const web3 = new Web3(...);
await migrateBase(web3); // migrates all base contracts writes addresses to 'base.json' and returns them.
await migrateDAO(web3); // migrates new DAO writes info to 'dao.json' and returns them.
```

## `base.json`

To get the base migrated contract addresses:

```javascript
const base = require("@daostack/ganache/base.json");
const {
  // Base contract addresses
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
} = migration;
```

## `dao.json`

To get information about the migrated DAO:

```javascript
const base = require("@daostack/ganache/dao.json");
const {
  orgName,            // name of the dao
  Avatar              // avatar address
  NativeToken,        // native token address
  NativeReputation    // native reputation address
} = migration;
```

## The Migrated DAO

The migrated DAO is a simple DAO with the following configuration:

- using `UController` as a controller.
- founders - first 5 accounts generated from `mnemonic` each with `1000` native token and `1000` reputation.
- no native token cap.
- schemes:
  - `SchemeRegistrar`
    - permissions: all permissions (`0x0000001F`)
    - voting machine: `AbsoluteVote(votePerc=50,ownerVote=true)`
  - `GlobalConstraintRegistrar`
    - permissions: manage global constraints (`0x00000004`)
    - voting machine: `AbsoluteVote(votePerc=50,ownerVote=true)`
  - `UpgradeScheme`
    - permissions: manage schemes + upgrade controller (`0x0000000A`)
    - voting machine: `AbsoluteVote(votePerc=50,ownerVote=true)`
  - `ContributionReward`
    - orgNativeTokenFee: no fee.
    - permissions: no permissions (`0x00000000`)
    - voting machine: `GenesisProtocol(<details in params.json file>)`
