import isPromise from './utils/isPromise';

const noop = () => {};

export default () => {
  let promises = [];

  const promisesMiddleware = ({ dispatch, getState }) => {
    return (next) => (action) => {
      if (typeof action === 'function') {
        const promise = action(dispatch, getState);
        if (isPromise(promise)) {
          promises.push(promise);
          promise.then(noop, noop).then(() => {
            promises = promises.filter((p) => (p !== promise));
          });
        }
        return promise;
      } else {
        return next(action);
      }
    };
  };

  promisesMiddleware.then = (callback) => {
    return Promise.all(promises).then(noop, noop).then(callback);
  };

  return promisesMiddleware;
};
