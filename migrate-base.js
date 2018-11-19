async function migrateBase({ web3, spinner, confirm, opts, logTx, previousMigration }) {
	if (!(await confirm('About to migrate base contracts. Continue?'))) {
		return;
	}

	const addresses = {};
	async function deploy({ contractName, abi, bytecode, deployedBytecode }, deps, ...args) {
		deps = deps || [];
		const existing = previousMigration.base || {};
		const sameDeps = deps.reduce((acc, dep) => addresses[dep] === existing[dep] && acc, true);
		const sameCode = existing[contractName] && deployedBytecode === (await web3.eth.getCode(existing[contractName]));
		if (
			sameCode &&
			sameDeps &&
			!(await confirm(
				`Found exsiting '${contractName}' instance with same bytecode and ${
					!deps.length ? 'no ' : ''
				}dependecies on other contracts at '${existing[contractName]}'. Deploy new instance?`,
				false
			))
		) {
			addresses[contractName] = existing[contractName];
			return existing[contractName];
		}

		spinner.start(`Migrating ${contractName}...`);
		const C = new web3.eth.Contract(abi, undefined, opts);
		const deploy = C.deploy({
			data: bytecode,
			arguments: args,
		}).send();
		const tx = await new Promise(res => deploy.on('receipt', res));
		const c = await deploy;
		await logTx(tx, `${c.options.address} => ${contractName}`);
		addresses[contractName] = c.options.address;
		return c.options.address;
	}

	const DAOToken = await deploy(
		require('@daostack/arc/build/contracts/DAOToken.json'),
		[],
		'DAOstack',
		'GEN',
		web3.utils.toWei('100000000')
	);
	const ControllerCreator = await deploy(require('@daostack/arc/build/contracts/ControllerCreator.json'));

	const DaoCreator = await deploy(
		require('@daostack/arc/build/contracts/DaoCreator.json'),
		['ControllerCreator'],
		ControllerCreator
	);
	const UController = await deploy(require('@daostack/arc/build/contracts/UController.json'));
	const GenesisProtocol = await deploy(
		require('@daostack/arc/build/contracts/GenesisProtocol.json'),
		['DAOToken'],
		DAOToken
	);
	const SchemeRegistrar = await deploy(require('@daostack/arc/build/contracts/SchemeRegistrar.json'));
	const UpgradeScheme = await deploy(require('@daostack/arc/build/contracts/UpgradeScheme.json'));
	const GlobalConstraintRegistrar = await deploy(
		require('@daostack/arc/build/contracts/GlobalConstraintRegistrar.json')
	);
	const ContributionReward = await deploy(require('@daostack/arc/build/contracts/ContributionReward.json'));
	const AbsoluteVote = await deploy(require('@daostack/arc/build/contracts/AbsoluteVote.json'));
	const QuorumVote = await deploy(require('@daostack/arc/build/contracts/QuorumVote.json'));
	const SimpleICO = await deploy(require('@daostack/arc/build/contracts/SimpleICO.json'));
	const TokenCapGC = await deploy(require('@daostack/arc/build/contracts/TokenCapGC.json'));
	const VestingScheme = await deploy(require('@daostack/arc/build/contracts/VestingScheme.json'));
	const VoteInOrganizationScheme = await deploy(require('@daostack/arc/build/contracts/VoteInOrganizationScheme.json'));
	const OrganizationRegister = await deploy(require('@daostack/arc/build/contracts/OrganizationRegister.json'));
	const Redeemer = await deploy(
		require('@daostack/arc/build/contracts/Redeemer.json'),
		['ContributionReward', 'GenesisProtocol'],
		ContributionReward,
		GenesisProtocol
	);

	return {
		base: addresses,
	};
}

module.exports = migrateBase;
