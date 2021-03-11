![alchemy logo](./assets/logo.png)

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
