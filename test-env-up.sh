#!/usr/bin/env bash

docker-compose up -d graph-node
./scripts/wait-for-it.sh 127.0.0.1:8545
./scripts/wait-for-it.sh 127.0.0.1:8000
./scripts/wait-for-it.sh 127.0.0.1:8020
sleep 60
cd node_modules/@daostack/subgraph-test-env
npm i
npm run deploy && cd ../../../
