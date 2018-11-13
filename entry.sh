#!/bin/bash

source .env
node ./build/cli.node.js --db=db --mnemonic="$mnemonic" --accounts="$total_accounts" "$@"