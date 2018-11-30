# Development notes


## Temporarily "distributing" as a typescript library

To make development easy, we are not really distributing the client as a proper package yet.
Basically, instead of having on our `package.json` this:

```
"main": "dist/lib/arc.js",
"typings": "dist/types/arc.d.ts",

```
WE use this:
```
"main": "src/arc.ts",
```
Which means the package will only work as a part of a typescript project.
This makes development much easier, because we can use the package directly (install from github, or `npm link` it locally)

When the package is mature, we will package it properly..
