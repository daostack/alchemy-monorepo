require('dotenv').config({ path: __dirname });
const Ganache = require('ganache-cli');
const path = require('path');

const defaults = {
	db_path: path.normalize(path.join(__dirname, './db')),
	seed: 'TestRPC is awesome!', // default ganache-cli mnemonic (https://github.com/trufflesuite/ganache-cli/blob/develop/cli.js#L45)
};

module.exports = {
	Ganache: {
		server: opts => Ganache.server({ ...defaults, ...opts }),
		provider: opts => Ganache.provider({ ...defaults, ...opts }),
	},
	migration: require('./migration.json'),
	...require('./migrate'),
};
