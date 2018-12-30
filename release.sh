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
# done
echo "Done!"
