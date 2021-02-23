const fs = require("fs")
const path = require('path')
const verbose = true
const ABI_DIR = path.resolve('./src/abis')
const ncp = require("ncp").ncp
const rimraf = require("rimraf")
const optimizer = require("@daostack/migration/optimize-abis")

async function optimizeABIs () {
  optimizer.initDirectory()
  await optimizer.noBytecode()
  await optimizer.noWhitespace()
  await optimizer.noDuplicates()
}

async function copyMigrationScript () {
  const toCopy = [
    // "migrate-dao.js",
    // "utils.js",
    // "sanitize.js",
    // "migration.json",
    "contracts-optimized"
  ]
  const baseDir = path.dirname(require.resolve("@daostack/migration"))
  const destDir = path.join(__dirname, "../src/abis")

  // Remove all existing files in the destination directory
  console.log(1)
  fs.readdirSync(destDir).forEach(file => {
    rimraf.sync(path.join(destDir, file))
  })

  console.log(1)
  // Copy all required files to the destination directory
  toCopy.forEach(async (file) => {
    console.log(file)
    await new Promise((resolve, reject) => {
      // Create nested folders if there are any
      const dest = path.join(destDir, file)
      const dir = path.dirname(dest)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }

      console.log('xx')
      ncp(path.join(baseDir, file), dest, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  })
}

function log(msg) {
  if (verbose) {
    console.log(msg)
  }
}
const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

/**
 * Fetch all abis from @daostack/migration into the `abis` folder.
 */
async function copyABIs() {
  const destDir = ABI_DIR
  const sourcePath = path.resolve(`${require.resolve('@daostack/migration')}/../contracts-optimized`)
  log(`copying ABIs from ${sourcePath} to ${destDir}`)
  getDirectories(sourcePath).forEach(arcVersion => {
    if (!fs.existsSync(path.join(destDir, arcVersion))) {
        fs.mkdirSync(path.join(destDir, arcVersion), { recursive: true })
    }

    const files = fs.readdirSync(`${sourcePath}/${arcVersion}`)
    files.forEach(file => {
      const artefact = JSON.parse(fs.readFileSync(`${sourcePath}/${arcVersion}/${file}`), 'utf-8')
      const smallerArtefact = {
        constractName: artefact.contractName,
        abi: artefact.abi,
        rootVersion: artefact.rootVersion
      }
      fs.writeFileSync(
        path.join(destDir, arcVersion, file),
        JSON.stringify(smallerArtefact, undefined, 2),
        'utf-8'
      )
    })
  })
}

// if (require.main === module) {
//   copyABIsFromMigration().catch(err => {
//     console.log(err)
//     process.exit(1)
//   })
// } else {
//   module.exports = copyABIsFromMigration
// }

async function run () {
  await optimizeABIs()
  await copyABIs()
}

if (require.main === module) {
  run().catch(err => {
    console.log(err)
    process.exit(1)
  })
} else {
  module.exports = optimizeABIs
}



