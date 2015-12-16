# redux-promises

[![NPM Version](https://img.shields.io/npm/v/redux-promises.svg?style=flat)](https://npmjs.org/package/redux-promises)
[![Build Status](https://img.shields.io/travis/CrocoDillon/redux-promises.svg?style=flat)](https://travis-ci.org/CrocoDillon/redux-promises)

Promise based middleware for Redux to deal with asynchronous actions. `redux-promises` is backwards compatible with [`redux-thunk`](https://github.com/gaearon/redux-thunk). It works by collecting any promise returned by action thunks, to keep track whether or not these promises are pending or not.

```bash
npm install --save redux-promises
```

## Why?

For server-side rendering in React you need to know when all asynchronous requests are either resolved or rejected. As a bonus you get thunks for free!
