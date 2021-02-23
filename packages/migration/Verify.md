# Verify Contracts

For each contract whose address appears in migration.json (and therefore is a "migrated contract") we send the contract's solidity code to etherscan.io which will attempt to "verify" that the given code corresponds to the bytecodes deployed at the address given in migration.json.

**Note** Contract validation via this script currently does not work on Windows (truffle-flattener generates invalid flattened .sol files).  The fix for that is at this writing in PR at truffle-flattener.

## Setup
1. In the project root, create an ".env" file (or use the existing one) that contains:
```
APIKEY=[API key from https://etherscan.io/myapikey]
```

Alternately you can supply this as an OS environment variable when you run `build.verify`.

2. initialize just one time, required by `build.verify`:

```script
npm run verify.initialize
```

3. build just one time or whenever you modify verify.ts, required by `verify`:

```script
npm run verify.build
```

## Verify

### Verify all of the contracts migrated to the given network

```script
npm run verify -- -p [provider url] -n kovan
```

### Verify all of the contracts of a specific Arc version migrated to the given network

```script
npm run verify -- -p [provider url] -n kovan -v 0.0.1-rc.18
```

The default Arc version is the last version listed in the migration.json file for the given network.

### Verify a single scheme

```script
npm run verify -- -c UpgradeScheme -p [provider url] -n kovan
```

Outputs a GUID that you can use with `npm run verify -- -g`.

### Verify a single scheme at an address

```script
npm run verify -- -c UpgradeScheme -a 0x12345... -p [provider url] -n kovan
```

### Obtain a flattened contract

Output the flattened script to a file named "flattened.[contractName].sol", by supplying the absolute path to a folder in which to write the file(s):

```script
npm run verify -- -f [absolute folder path] [...] -p [provider url] -n kovan
```

### Check verification status, given GUID

Given the GUID that is output by `npm run verify`:

```script
npm run verify -- -g [GUID] -n kovan
```

## Help
```script
npm run verify.help
```

## Lint

```script
npm run verify.lint
```

And fix:

```script
npm run verify.lint.andFix
```

