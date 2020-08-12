#!/usr/bin/env bash

docker-compose up -d graph-node
./scripts/wait-for-it.sh 127.0.0.1:8545
./scripts/wait-for-it.sh 127.0.0.1:8000
./scripts/wait-for-it.sh 127.0.0.1:8020
