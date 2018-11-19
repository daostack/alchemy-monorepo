#!/bin/bash

set -e

# migrate ganache
echo "Migrating ganache..."
npm run migrate -- "$@"
# set version
echo "Setting version..."
node set-version.js
# publish npm
echo "Publishing to npm..."
npm publish
# publish docker
echo "Publishing to dockerhub..."
npm run build:docker
npm run publish:docker
# commit addresses
echo "Commiting changes..."
git commit -a -m "release $(cat package.json | jq -r '.version')"
# push to git
echo "Pushing to github..."
git push -f
# done
echo "Done!"