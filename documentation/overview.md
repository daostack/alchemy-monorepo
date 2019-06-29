# Overview

All query-like functions (i.e. `proposals()` return an (rxjs `Observable`)[https://rxjs-dev.firebaseapp.com/guide/observable]


Here are some examples of queries:


where clauses
```
  dao.proposals({ where: { scheme: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'}})
  dao.proposals({ where: { scheme_in: ['0xffcf8fdee72ac11b5c542428b35eef5769c409f0']}})
```

Paging
```
  dao.proposals({ skip: 100, first: 100})
```

Sorting:
```
  dao.proposals({ orderBy: 'createdAt', orderDirection: 'desc'})
```
