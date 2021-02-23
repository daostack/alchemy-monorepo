echo 'npm ci:' && echo -en 'travis_fold:start:script.1\\r'
npm ci
echo -en 'travis_fold:end:script.1\\r'

npm run test-env-up

echo 'Debug info:' && echo -en 'travis_fold:start:script.3\\r'
docker-compose logs ganache
docker-compose logs graph-node
echo -en 'travis_fold:end:script.3\\r'
# sleep a bit to make sure the subgraph is ready
sleep 15
echo -en 'travis_fold:end:script.2\\r'
npm run lint
npm run test
npm run build