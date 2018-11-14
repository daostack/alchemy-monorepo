// Set the package version to @daostack/arc version

const fs = require("fs");
const { migrationVersion } = require("./params.json");
const package = require("./package.json");
const arcVersion =
  package.dependencies["@daostack/arc"] ||
  package.devDependencies["@daostack/arc"];
package.version = `${arcVersion}-v${migrationVersion}`;
fs.writeFileSync(
  "package.json",
  JSON.stringify(package, undefined, 2),
  "utf-8"
);
