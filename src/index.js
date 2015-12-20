import isPromise from './utils/isPromise';

const noop = () => {};

export default () => {
  let promises = [];

  const promisesMiddleware = ({ dispatch, getState }) => {
    return (next) => (action) => {
      if (typeof action === 'function') {
        let promise = action(dispatch, getState);
        if (isPromise(promise)) {
          promise = promise.then(noop, noop);
          promise.then(() => {
            promises = promises.filter((p) => (p !== promise));
          });
          promises.push(promise);
        }
        return promise;
      } else {
        return next(action);
      }
    };
  };

  promisesMiddleware.then = (callback) => {
    return Promise.all(promises).then(callback);
  };

  return promisesMiddleware;
};
