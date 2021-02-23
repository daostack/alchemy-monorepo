#!/bin/bash

set -e
source .env

# publish docker
echo "Publishing to dockerhub..."
npm run docker:build
npm run docker:push
# publish npm
echo "Publishing to npm..."
npm login
npm publish
# tag on github
git tag -a $(cat package.json | jq -r '.version') -m "Release of version $(cat package.json | jq -r '.version')"
git push --tags
# done
echo "Done!"
