# DAOstack Ganache

A ganache with all DAOstack contracts and an example DAO already migrated.
This repo is exposed both as an npm package, a CLI and a docker container which you can use as a drop-in replacement for [`ganache-cli`](https://github.com/trufflesuite/ganache-cli#using-ganache-cli).

## Versioning

Both the npm package and the docker image are versioned according to the `@daostack/arc` package and the migration version.
Example: `@daostack/arc@<arc version>` -> npm: `@daostack/ganache@<arcversion>-v<migration version>` and dockerhub: `daostack/ganache:X.Y.Z-v<migration version>`

## Use the docker image

1. `docker pull daostack/ganache`
2. `docker run daostack/ganache ...` - use arguments as specified in `ganache-cli`

## Use as a library

1. `npm install @daostack/ganache`
2. `const Ganache = require('@daostack/ganache') // instead of: require('ganache-cli')` - use as a drop-in replacement for the `ganache-cli` library.

## `migration.json`

To get the migrated contract addresses, info about the example DAO and more:

```javascript
const migration = require('@daostack/ganache/migration.json')
const {
    total_accounts, // number of generated accounts (each with 100 eth)
    mnemonic,       // mnemonic used to generate accounts
    addresses: {
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
    },
    DAO: {
        orgName,            // name of the dao
        Avatar              // avatar address
        NativeToken,        // native token address
        NativeReputation    // native reputation address
    }
} = migration;
```

## The example DAO

The example DAO is a simple DAO with the following configuration:

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
