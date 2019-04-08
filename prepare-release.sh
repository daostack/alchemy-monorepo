#!/bin/bash

set -e
source .env


# npm ci
echo "Installing NPM modules..."
npm install
npm ci
# generate abis
echo "Generating abis..."
npm run generate-abis
# prune arc build
echo "Pruning Arc build..."
npm run prune-arc-build -- "$@"
# migrate ganache
echo "Migrating ganache..."
npm run migrate -- "$@"
# migrate kovan
echo "Migrating kovan..."
npm run migrate -- --gasPrice 10 --provider $kovan_provider --private-key $kovan_private_key "$@"
# migrate rinkeby
echo "Migrating rinkeby..."
npm run migrate -- --gasPrice 10 --provider $rinkeby_provider --private-key $rinkeby_private_key "$@"
# migrate mainnet
echo "Migrating mainnet..."
npm run migrate -- --gasPrice 30 --provider $mainnet_provider --private-key $mainnet_private_key "$@"
# set version
echo "Setting version..."
node set-version.js
# update npm package lock
echo "Updating package-lock..."
npm install
echo "Running linter..."
npm run lint-fix
# commit addresses
echo "Commiting changes..."
git add -A && git commit -m "release $(cat package.json | jq -r '.version')"
# push to git
echo "Pushing to github..."
git push -f
# done
echo "Done!"
