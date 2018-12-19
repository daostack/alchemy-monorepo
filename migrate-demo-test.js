async function migrateDemoTest({ web3, spinner, confirm, opts, migrationParams, logTx, previousMigration: { base } }) {
	if (!(await confirm('About to migrate new Demo Test. Continue?'))) {
		return;
	}

	if (!base) {
		const msg = `Couldn't find existing base migration ('migration.json' > 'base').`;
		spinner.fail(msg);
		throw new Error(msg);
	}

	const {
		UController,
		DaoCreator,
		ContributionReward,
		GenesisProtocol
	} = base;

	spinner.start('Migrating Demo Test...');

	let accounts = web3.eth.accounts.wallet;

	if (accounts[1] == undefined) {
		web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(
			"0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1"
		));
		web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(
			"0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c"
		));
		accounts = web3.eth.accounts.wallet;
	}
	let tx;

    const externalToken = await new web3.eth.Contract(
		require('@daostack/arc/build/contracts/DAOToken.json').abi,
      undefined,
      opts,
    )
      .deploy({
        data: require('@daostack/arc/build/contracts/DAOToken.json').bytecode,
        arguments: ['External', 'EXT', 0],
      })
	  .send();
	//tx = externalToken
	//await logTx(tx, 'Created new External Token.');
	

    const daoCreator = new web3.eth.Contract(
		require('@daostack/arc/build/contracts/DaoCreator.json').abi,
      DaoCreator,
      opts,
    )

	const [orgName, tokenName, tokenSymbol, founders, tokenDist, repDist, uController, cap] = [
		'Genesis Test',
		'Genesis Test',
		'GDT',
		migrationParams.founders.map(({ address }) => address),
		migrationParams.founders.map(({ tokens }) => tokens),
		migrationParams.founders.map(({ reputation }) => reputation),
		UController,
		'0',
	];
	
    spinner.start('Creating a new organization...');
	const forge = daoCreator.methods.forgeOrg(
		orgName,
		tokenName,
		tokenSymbol,
		founders,
		tokenDist,
		repDist,
		uController,
		cap
	);
    const avatarAddress = await forge.call();
	tx = await forge.send();
	await logTx(tx, 'Created new organization.');

    const contributionReward = new web3.eth.Contract(
		require('@daostack/arc/build/contracts/ContributionReward.json').abi,
      ContributionReward,
      opts,
	);
	
    const genesisProtocol = new web3.eth.Contract(
		require('@daostack/arc/build/contracts/GenesisProtocol.json').abi,
      GenesisProtocol,
      opts,
    );

    const gpParams = {
      boostedVotePeriodLimit: 259200,
      daoBountyConst: 75,
      daoBountyLimitGWei: 100,
      minimumStakingFeeGWei: 0,
      preBoostedVotePeriodLimit: 1814400,
      preBoostedVoteRequiredPercentage: 50,
      proposingRepRewardConstA: 5,
      proposingRepRewardConstB: 5,
      quietEndingPeriod: 86400,
      stakerFeeRatioForVoters: 50,
      thresholdConstAGWei: 7,
      thresholdConstB: 3,
      voteOnBehalf: '0x0000000000000000000000000000000000000000',
      votersGainRepRatioFromLostRep: 80,
      votersReputationLossRatio: 1,
	};
	
    const gpSetParams = genesisProtocol.methods.setParameters(
      [
        gpParams.preBoostedVoteRequiredPercentage,
        gpParams.preBoostedVotePeriodLimit,
        gpParams.boostedVotePeriodLimit,
        web3.utils.toWei(gpParams.thresholdConstAGWei.toString(), 'gwei'),
        gpParams.thresholdConstB,
        web3.utils.toWei(gpParams.minimumStakingFeeGWei.toString(), 'gwei'),
        gpParams.quietEndingPeriod,
        gpParams.proposingRepRewardConstA,
        gpParams.proposingRepRewardConstB,
        gpParams.stakerFeeRatioForVoters,
        gpParams.votersReputationLossRatio,
        gpParams.votersGainRepRatioFromLostRep,
        gpParams.daoBountyConst,
        web3.utils.toWei(gpParams.daoBountyLimitGWei.toString(), 'gwei'),
      ],
      gpParams.voteOnBehalf,
    );
    const gpParamsHash = await gpSetParams.call();
    tx = await gpSetParams.send();
	await logTx(tx, 'Genesis Protocol Set Parameters.');

    const crParams = {
      orgNativeTokenFeeGWei: 0,
    };
    const crSetParams = contributionReward.methods.setParameters(
      web3.utils.toWei(crParams.orgNativeTokenFeeGWei.toString(), 'gwei'),
      gpParamsHash,
      GenesisProtocol,
    );
    const crParamsHash = await crSetParams.call();
	tx = await crSetParams.send();
	await logTx(tx, 'Contribution Reward Set Parameters.');

    const schemes = [
      {
        address: ContributionReward,
        params: crParamsHash,
        permissions: '0x00000000', /* no special params */
      },
	];
	
    tx = await daoCreator.methods
      .setSchemes(
        avatarAddress,
        schemes.map(({ address }) => address),
        schemes.map(({ params }) => params),
        schemes.map(({ permissions }) => permissions),
      )
	  .send();
	  
	await logTx(tx, 'Dao Creator Set Schemes.');

    // END setup
    const descHash =
      '0x000000000000000000000000000000000000000000000000000000000000abcd';
    async function propose({
      rep,
      tokens,
      eth,
      external,
      periodLength,
      periods,
      beneficiary,
    }) {
      const prop = contributionReward.methods.proposeContributionReward(
        avatarAddress,
        descHash,
        rep,
        [tokens, eth, external, periodLength, periods],
        externalToken.options.address,
        beneficiary,
      );
      const proposalId = await prop.call();
      const tx = await prop.send();
	  await logTx(tx, 'Submit new Proposal.');

      return proposalId;
    }

    const [PASS, FAIL] = [1, 2];
    async function vote({ proposalId, outcome, voter }) {
      	tx = await genesisProtocol.methods
        	.vote(proposalId, outcome, voter)
			.send({ from: voter });
		
		await logTx(tx, 'Vote on Proposal.');
    }

    const proposalId = await propose({
      rep: 10,
      tokens: 10,
      eth: 10,
      external: 10,
      periodLength: 0,
      periods: 1,
      beneficiary: accounts[1].address,
	});
	
    await vote({
      proposalId: proposalId,
      outcome: FAIL,
      voter: accounts[2].address,
	});
	
    await vote({
      proposalId: proposalId,
      outcome: PASS,
      voter: accounts[1].address,
	});
	
	const avatar = new web3.eth.Contract(require('@daostack/arc/build/contracts/Avatar.json').abi, avatarAddress, opts);
	const Avatar = avatarAddress
	const NativeToken = await avatar.methods.nativeToken().call();
	const NativeReputation = await avatar.methods.nativeReputation().call();

	return {
		test: {
			name: orgName,
			Avatar,
			NativeToken,
			NativeReputation,
			proposalId,

		},
	};
}

module.exports = migrateDemoTest;
