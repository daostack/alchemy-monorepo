npm run docker:stop
docker --version
docker-compose --version

docker-compose up -d graph-node
docker-compose logs graph-node

echo 'npm ci:' && echo -en 'travis_fold:start:script.1\\r'
npm ci
echo -en 'travis_fold:end:script.1\\r'

  # deploy contracts etc
npm run deploy

echo 'Debug info:' && echo -en 'travis_fold:start:script.2\\r'
docker images --digests | grep graph-node
docker-compose exec graph-node graph-node --version
  # - docker-compose logs graph-node
echo -en 'travis_fold:end:script.2\\r'
sleep 180

npm run lint
npm run jest
npm run docker:stop
