const yargs = require('yargs')
const fs = require('fs')
const fsExtra = require('fs-extra')
const equal = require('fast-deep-equal')
const absP = path => `${__dirname}/${path}`

/**
 * Initialize the contracts-optimized directory
 */
function initDirectory () {
  fsExtra.copySync(absP('./contracts'), absP('./contracts-optimized'), {
    overwrite: true
  })
}

/**
 * Remove duplicate ABIs, and replacing the duplicate
 * with a pointer to the original (root ABI)
 */
async function noDuplicates () {
  const versionDirs = fs.readdirSync(absP('./contracts-optimized'))

  // For each version (skipping the first)
  for (let i = 1; i < versionDirs.length; ++i) {
    const version = versionDirs[i]
    const prevVersion = versionDirs[i - 1]

    // For each ABI
    const abis = fs.readdirSync(absP(`./contracts-optimized/${version}`))
    for (const abi of abis) {
      try {
        const abiJson = JSON.parse(fs.readFileSync(absP(`./contracts-optimized/${version}/${abi}`), 'utf-8'))
        let rootVersion = prevVersion
        let rootAbiJson = JSON.parse(fs.readFileSync(absP(`./contracts-optimized/${rootVersion}/${abi}`), 'utf-8'))

        if (rootAbiJson.rootVersion) {
          rootVersion = rootAbiJson.rootVersion
          rootAbiJson = JSON.parse(fs.readFileSync(absP(`./contracts-optimized/${rootVersion}/${abi}`), 'utf-8'))
        }

        // Check to see if they're the same
        if (equal(abiJson, rootAbiJson)) {
          // Replace the duplicate with a "Root ABI Pointer"
          fs.writeFileSync(
            absP(`./contracts-optimized/${version}/${abi}`),
            JSON.stringify({ rootVersion })
          )
        }
      } catch (e) { /* Do nothing because this is a newly added ABI */ }
    }
  }
}

/**
 * Remove the bytecode from the ABIs to reduce package size.
 * This can be used by external projects that use this library
 * for the creation of new DAOs, and do not require instantiating
 * new contracts. An example is the DAOcreator, which uses the
 * DaoCreator Contract to create new DAOs.
 */
async function noBytecode () {
  const versionDirs = fs.readdirSync(absP('./contracts-optimized'))

  // For each version
  for (let i = 0; i < versionDirs.length; ++i) {
    const version = versionDirs[i]

    // For each ABI
    const abis = fs.readdirSync(absP(`./contracts-optimized/${version}`))
    for (const abi of abis) {
      const abiJson = JSON.parse(fs.readFileSync(absP(`./contracts-optimized/${version}/${abi}`), 'utf-8'))

      if (abiJson.bytecode) {
        delete abiJson.bytecode
      }

      if (abiJson.deployedBytecode) {
        delete abiJson.deployedBytecode
      }

      fs.writeFileSync(
        absP(`./contracts-optimized/${version}/${abi}`),
        JSON.stringify(abiJson, null, 2)
      )
    }
  }
}

/**
 * Remove the whitespace from ABIs to reduce package size.
 */
async function noWhitespace () {
  const versionDirs = fs.readdirSync(absP('./contracts-optimized'))

  // For each version
  for (let i = 0; i < versionDirs.length; ++i) {
    const version = versionDirs[i]

    // For each ABI
    const abis = fs.readdirSync(absP(`./contracts-optimized/${version}`))
    for (const abi of abis) {
      const abiJson = JSON.parse(fs.readFileSync(absP(`./contracts-optimized/${version}/${abi}`), 'utf-8'))

      fs.writeFileSync(
        absP(`./contracts-optimized/${version}/${abi}`),
        JSON.stringify(abiJson)
      )
    }
  }
}

function cli () {
  /* eslint no-unused-expressions: "off" */
  yargs
    .command('init', 'Initialize the contracts-optimized directory.', yargs => yargs, initDirectory)
    .command('no-duplicates', 'Remove all duplicate ABIs.', yargs => yargs, noDuplicates)
    .command('no-bytecode', 'Remove all bytecode from the ABIs.', yargs => yargs, noBytecode)
    .command('no-whitespace', 'Remove all whitespace from the ABIs.', yargs => yargs, noWhitespace)
    .command('$0', 'Remove duplicates, bytecode, and whitespace from the ABIs', yargs => yargs, async () => {
      initDirectory()
      await noDuplicates()
      await noBytecode()
      await noWhitespace()
    })
    .showHelpOnFail(false)
    .completion()
    .wrap(120)
    .strict()
    .help().argv
}

if (require.main === module) {
  cli()
} else {
  module.exports = {
    initDirectory,
    noDuplicates,
    noBytecode,
    noWhitespace
  }
}
