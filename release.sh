#!/bin/bash

set -e
source .env

# migrate ganache
echo "Migrating ganache..."
npm run migrate -- "$@"
# migrate ganache
echo "Migrating kovan..."
npm run migrate -- --provider $kovan_provider --private-key $kovan_private_key "$@"
# set version
echo "Setting version..."
node set-version.js
# publish docker
echo "Publishing to dockerhub..."
npm run docker:build
npm run docker:push
# publish npm
echo "Publishing to npm..."
npm login
npm publish
# commit addresses
echo "Commiting changes..."
git add -A && git commit -m "release $(cat package.json | jq -r '.version')"
# push to git
echo "Pushing to github..."
git push -f
# done
echo "Done!"