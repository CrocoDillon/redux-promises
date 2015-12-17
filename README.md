# redux-promises

[![NPM Version](https://img.shields.io/npm/v/redux-promises.svg?style=flat)](https://npmjs.org/package/redux-promises)
[![Build Status](https://img.shields.io/travis/CrocoDillon/redux-promises.svg?style=flat)](https://travis-ci.org/CrocoDillon/redux-promises)

Promise based middleware for Redux to deal with asynchronous actions. `redux-promises` is backwards compatible with [`redux-thunk`](https://github.com/gaearon/redux-thunk). It works by collecting any promise returned by action thunks, to keep track whether or not these promises are pending or not.

```bash
npm install --save redux-promises
```

## Why?

For server-side rendering in React you need to know when all asynchronous requests are either resolved or rejected. As a bonus you get thunks for free!

## Examples

A simple example (working code can be found in the examples directory)

```javascript
import { createStore, applyMiddleware } from 'redux';
import promises from 'redux-promises';
import reducers from './reducers';

const promisesMiddleware = promises();
const store = applyMiddleware(promisesMiddleware)(createStore)(reducers);

// Action creator that returns a thunk that returns a promise
const fetchData = (url) => (dispatch) => {
  dispatch({ type: 'FETCH_REQUEST' });

  return fetch(url).then(
    (result) => dispatch({ type: 'FETCH_SUCCESS', result }),
    (error) => dispatch({ type: 'FETCH_FAILURE', error })
  );
};

// Somewhere else in your application there are some dispatches
store.dispatch(fetchData('http://api.example.com/some/resouce'));
store.dispatch(fetchData('http://api.example.com/another/resouce'));

// Now we wait till all required data has been fetched
promisesMiddleware.then(() => {
  // Fetching all data complete
});
```
