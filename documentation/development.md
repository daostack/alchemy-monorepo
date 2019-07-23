# Developing

For development, it is useful to have local instances of Ganache (an ethereum node), IPFS (which is used to store data), an instance of The Graph with the DAOStack subgraph.
The package is provided with convenient docker containers that provide  a  complete environment for testing and development:

Get all services running:
```sh
docker-compose up
```

This command will build and start a graph instance, ganache, IPFS and postgresql.


To run the tests, run:
```
npm run test
```

You may also want to run the (demo.js)[./documentation/demo.js] file for some concrete examples of the usage of the library:
```
node documentation/demo.js
```
After you are done, run:
```
docker-compose down
```

## Testing

run a specific test:
```sh
npm run test -- test/arc.spec.ts
```
Or watch:
```sh
npm run test -- --watch
```

### Commands

 - `npm run build`: Generate bundles and typings, create docs
 - `npm run lint`: Lints code
 - `npm run test`: run all tests
