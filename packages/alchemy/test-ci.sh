npm ci
sudo apt-get install -y libsecret-1-dev curl
docker-compose logs ganache
docker-compose logs graph-node
# sleep a bit to make sure the subgraph is ready
sleep 15
npm run lint -- --quiet
npm run test:unit -- --forceExit
npm run build