![alchemy logo](./assets/logo.png)

# Alchemy Monorepo

This is where DAOstack's smart contracts and UI lives. This repository contains the following packages:

* [Alchemy](./packages/alchemy) the [web application](https://alchemy.daostack.io/)
* [Arc.js](./packages/arc.js) the [Javascript library](https://www.npmjs.com/package/@daostack/arc)
* [Arc](./packages/arc) and [Infra](./packages/infra) the smart contract library
* [Migration](./packages/migration) contains scripts and settings to deploy DAOs
* [Subgraph](./packages/subgraph) contains definitions for our index on the Graph.
 
DAOstacks Stack is further documented here: https://www.notion.so/daostack/DAOstack-Documentation-ae5ea274d91e4132a1d48178aa52af06

# Usage

To get started, check out this repository and run:

```
npm 
npm lerna bootstrap
```

## Alchemy Development


 ### Develop with Rinkeby

 To start a local server:

 ```
 cd packages/alchemy && npm run start-staging
 ```

 If you make changes in arc.js, the typescript files need to be recompiled:

 ```
 cd packages/arc.js && npm run build:watch
 ```


## Alchemy Development


### Develop with Rinkeby

To start a local server:

```
cd packages/alchemy && npm run start-staging
```

If you make changes in arc.js, the typescript files need to be recompiled:

```
cd packages/arc.js && npm run build:watch
```
