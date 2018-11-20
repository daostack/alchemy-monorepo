#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const ora = require('ora');
const Web3 = require('web3');
const inquirer = require('inquirer');
const HDWallet = require('hdwallet-accounts');
const moment = require('moment');
const migrateBase = require('./migrate-base');
const migrateDAO = require('./migrate-dao');

async function migrate(opts) {
	const base = await migrateBase(opts);
	const dao = await migrateDAO({ ...opts, previousMigration: { ...opts.previousMigration, ...base } });
	return {
		...base,
		...dao,
	};
}

const defaults = {
	quiet: false,
	force: false,
	provider: 'http://localhost:8545',
	// this is the private key used by ganache when running with `--deterministic`
	privateKey: '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
	output: './migration.json',
	params: JSON.parse(fs.readFileSync(__dirname + '/migration-params.json')),
};

/**
 * A wrapper function that performs tasks common to all migration commands.
 */
const wrapCommand = fn => async options => {
	let { quiet, force, provider, gasPrice, privateKey, mnemonic, output, params } = { ...defaults, ...options };
	const emptySpinner = new Proxy({}, { get: () => () => {} }); // spinner that does nothing
	const spinner = quiet ? emptySpinner : ora();

	const confirm = async (msg, def) => {
		if (force) {
			return def === undefined ? true : def;
		} else {
			const { confirmation } = await inquirer.prompt([
				{ name: 'confirmation', message: msg, type: 'confirm', default: def },
			]);
			return confirmation;
		}
	};

	const web3 = new Web3(provider);
	gasPrice = gasPrice || web3.utils.fromWei(await web3.eth.getGasPrice(), 'gwei');

	// set web3 default account
	try {
		const account = web3.eth.accounts.privateKeyToAccount(privateKey || HDWallet(1, mnemonic).accounts[0].privateKey);
		web3.eth.accounts.wallet.add(account);
		web3.eth.defaultAccount = account.address;
	} catch (e) {
		spinner.fail(`Could not obtain an account for migration. Please specify a valid 'private-key' or 'mnemonic'`);
		console.error(e);
		process.exit(1);
	}

	const logTx = async ({ transactionHash, gasUsed }, msg) => {
		const { gasPrice } = await web3.eth.getTransaction(transactionHash);
		const txCost = web3.utils.fromWei((gasUsed * gasPrice).toString(), 'ether');
		spinner.info(`${transactionHash} | ${Number(txCost).toFixed(5)} ETH | ${msg}`);
	};

	const network = await web3.eth.net.getNetworkType();
	const balance = await web3.eth.getBalance(web3.eth.defaultAccount);

	spinner.info(`Network: \t${network}`);
	spinner.info(`Account: \t${web3.eth.defaultAccount}`);
	spinner.info(`Balance: \t${web3.utils.fromWei(balance)}ETH`);
	spinner.info(`Gas price: \t${gasPrice}GWei`);

	// default opts for web3
	const block = await web3.eth.getBlock('latest');
	const opts = {
		from: web3.eth.defaultAccount,
		gas: block.gasLimit - 100000,
		gasPrice: gasPrice ? web3.utils.toWei(gasPrice.toString(), 'gwei') : undefined,
	};

	// obtain time and balance before command
	const before = {
		time: moment(),
		balance,
	};

	// check for an existing migration
	let existingFile;
	if (fs.existsSync(output)) {
		spinner.info(`Found an existing previous migration file (${output})`);
		existingFile = JSON.parse(fs.readFileSync(output, 'utf-8'));
	} else {
		existingFile = {};
	}

	// run the actucal command
	const result = await fn({
		web3,
		spinner,
		confirm,
		opts,
		migrationParams: { ...params.default, ...params[network] },
		logTx,
		previousMigration: { ...existingFile[network] },
	});

	// obtain time and balance after command
	const after = {
		time: moment(),
		balance: await web3.eth.getBalance(web3.eth.defaultAccount),
	};

	spinner.info(
		`Finished in ${moment.duration(after.time.diff(before.time)).humanize()} and costed ${web3.utils.fromWei(
			(before.balance - after.balance).toString()
		)}ETH`
	);

	// write results to file
	fs.writeFileSync(
		output,
		JSON.stringify({ ...existingFile, [network]: { ...existingFile[network], ...result } }, undefined, 2),
		'utf-8'
	);

	spinner.succeed(`Wrote results to ${output}.`);

	return result;
};

function cli() {
	yargs
		.option('provider', {
			alias: 'p',
			type: 'string',
			describe: 'web3 provider url',
			default: defaults.provider,
		})
		.option('gas-price', {
			alias: 'g',
			describe: 'gas price in GWei. If not specified, will use an automatically suggested price.',
			type: 'number',
		})
		.option('quiet', {
			alias: 'q',
			describe: 'surpress console output',
			type: 'boolean',
			default: defaults.quiet,
		})
		.option('force', {
			alias: 'f',
			describe: 'disable confirmation messages',
			type: 'boolean',
			default: defaults.force,
		})
		.option('output', {
			alias: 'o',
			type: 'string',
			describe: 'filepath to output the migration results',
			default: defaults.output,
		})
		.option('params', {
			alias: 'i',
			type: 'string',
			describe: 'path to the file containing the migration parameters',
			default: 'migration-params.json',
			coerce: path => JSON.parse(fs.readFileSync(path)),
		})
		.option('private-key', {
			alias: 's',
			type: 'string',
			describe: `private key of the account used in migration (cannot be used with the 'mnemonic' option)`,
			default: defaults.privateKey,
			conflicts: ['mnemonic'],
		})
		.option('mnemonic', {
			alias: 'm',
			type: 'string',
			describe: `mnemonic used to generate the private key of the account used in migration (cannot be used with the 'private-key' option)`,
			conflicts: ['private-key'],
		})
		.command('$0', 'Migrate base contracts and an example DAO', yargs => yargs, wrapCommand(migrate))
		.command('base', 'Migrate an example DAO', yargs => yargs, wrapCommand(migrateBase))
		.command('dao', 'Migrate base contracts', yargs => yargs, wrapCommand(migrateDAO))
		.showHelpOnFail(false)
		.completion()
		.wrap(120)
		.strict()
		.help().argv;
}

if (require.main == module) {
	cli();
} else {
	module.exports = {
		migrate: wrapCommand(migrate),
		migrateBase: wrapCommand(migrateBase),
		migrateDAO: wrapCommand(migrateDAO),
		cli,
	};
}
