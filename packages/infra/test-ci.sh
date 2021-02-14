npm ci
rm -rf build/ # remove any remaining artifacts from a previous build
npx buidler --version
npx buidler clean

npx buidler test
npx buidler check
npx eslint .
# TODO: If branch is master
# npm run coveralls
