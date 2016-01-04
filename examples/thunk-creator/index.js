import { combineReducers, applyMiddleware, createStore } from 'redux';
import { reducer as idleReducer, createMiddleware, ensureIdleState } from '../../src';
import thunkCreator from './thunkCreator';
import fetch from './fetch';

// Reducer that just logs time since start and action object
const startTime = Date.now();
const logReducer = (state = null, action) => {
  console.log(`Dispatch after ${Date.now() - startTime}ms`)
  console.log(JSON.stringify(action, null, 2));
  return state;
};

const reducer = combineReducers({
  idle: idleReducer,
  log: logReducer
});

const promisesMiddleware = createMiddleware();
const store = applyMiddleware(promisesMiddleware)(createStore)(reducer);

// Action creator that returns a thunk that returns a promise
const fetchData = (url) => thunkCreator({
  types: ['FETCH_REQUEST', 'FETCH_SUCCESS', 'FETCH_FAILURE'],
  promise: fetch(url)
});

// Somewhere else in your application there are some dispatches
store.dispatch(fetchData('http://api.example.com/some/resouce'));
store.dispatch(fetchData('http://api.example.com/another/resouce'));

// Now we wait till all required data has been fetched
ensureIdleState(store).then(() => {
  console.log(`Fetching all data complete after ${Date.now() - startTime}ms`);
});
