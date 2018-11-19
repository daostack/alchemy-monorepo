// Set the package version to @daostack/arc version

const fs = require('fs');
const ora = require('ora');
const inquirer = require('inquirer');

async function setVersion() {
	const spinner = ora();
	const package = require('./package.json');
	const arcVersion = package.dependencies['@daostack/arc'] || package.devDependencies['@daostack/arc'];
	spinner.info(`Current package version is '${package.version}'`);
	spinner.info(`@daostack/arc version is '${arcVersion}'`);
	const { migrationVersion } = await inquirer.prompt([
		{
			type: 'input',
			name: 'migrationVersion',
			message: `What would you like to call this migration version ('${arcVersion}-v???')?`,
			validate: x => (x ? true : 'Please choose a version'),
		},
	]);

	package.version = `${arcVersion}-v${migrationVersion}`;
	fs.writeFileSync('package.json', JSON.stringify(package, undefined, 2), 'utf-8');
	spinner.succeed(`Updated package version to ${package.version}`);
}

if (require.main == module) {
	setVersion();
} else {
	module.exports = setVersion;
}
