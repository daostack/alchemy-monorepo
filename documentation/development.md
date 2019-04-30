# Developing

Get all services running:

```sh
docker-compose up graph-node
```

This command will build and start a graph instance, ganache, IPFS and postgresql.

Before being able to use these services, you need to deploy the DAOStack contracts and configure the graph node to listen to changes.
Open another terminal and run the following comand:
```sh
npm run setup-env
```

To run the tests, run:
```sh
npm run test
```

After you are done, run:
```
docker-compose down
```
If you update the subgraph dependency in `package.json`, you must re-configure the graph node:
```
npm run setup-env
```

##

run a specific test:
```sh
npm run test -- dao.test
```
Or watch:
```sh
npm run test -- --watch
```
