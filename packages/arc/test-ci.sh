set -x
rm -rf build/ # remove any remaining artifacts from a previous build
npm ci
npx hardhat --version
npx hardhat clean

npx hardhat test
npx hardhat check
npx eslint .
# TODO: If branch is master
# npm run coveralls
