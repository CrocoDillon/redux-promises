import isPromise from './utils/isPromise';

const SELECT_STATE = (state) => (state.idle);
const noop = () => {};

// constants
const CHANGE_IDLE_STATE = '@@redux-promises/CHANGE_IDLE_STATE';

// actions
const changeIdleState = (state) => ({
  type: CHANGE_IDLE_STATE,
  state
});

// reducers
const reducer = (state = true, action) => {
  switch (action.type) {
  case CHANGE_IDLE_STATE:
    return action.state;
  }
  return state;
};

const createMiddleware = () => {
  let promises = [];

  const middleware = ({ dispatch, getState }) => {
    return (next) => (action) => {
      if (typeof action === 'function') {
        const maybePromise = action(dispatch, getState);
        if (isPromise(maybePromise)) {
          const promise = maybePromise.then(noop, noop);
          promise.then(() => {
            promises = promises.filter((p) => (p !== promise));
            if (promises.length === 0) {
              dispatch(changeIdleState(true));
            }
          });
          promises.push(promise);
          dispatch(changeIdleState(false));
        }
        return maybePromise;
      } else {
        return next(action);
      }
    };
  };

  return middleware;
};

const ensureIdleState = (store, selectState = SELECT_STATE) => {
  const getIdleState = () => selectState(store.getState());

  if (process.env.NODE_ENV !== 'production' && typeof getIdleState() !== 'boolean') {
    throw new Error('Unable to get idle state, did you install the reducer ' +
      'and use the correct `selectState`? (default `(state) => (state.idle)`)');
  }

  if (getIdleState()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const unsubscribe = store.subscribe(() => {
      if (getIdleState()) {
        unsubscribe();
        resolve();
      }
    });
  });
};

export { reducer, createMiddleware, ensureIdleState };
