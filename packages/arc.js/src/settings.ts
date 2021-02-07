// the version of the redeemer contract to use.
// we can specify multiple versions, and try to find them in the order given
export const REDEEMER_CONTRACT_VERSIONS = [
  '0.0.1-rc.44',
  '0.0.1-rc.37',
  '0.0.1-rc.36'
]
// the version of the Reputation, and token contract instances
export const REPUTATION_CONTRACT_VERSION = '0.0.1-rc.19'
export const DAOTOKEN_CONTRACT_VERSION = '0.0.1-rc.19'
// used for a workaround
export const CONTRIBUTION_REWARD_DUMMY_VERSION = '0.0.1-rc.44'

// export const ABI_DIR = path.resolve('./node_modules/@daostack/migration/contracts-optimized')
export const ABI_DIR = './abis'
