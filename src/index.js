import isPromise from './utils/isPromise';

const noop = () => {};

export default () => {
  const promises = [];

  const promisesMiddleware = ({ dispatch, getState }) => {
    return (next) => (action) => {
      if (typeof action === 'function') {
        const promise = action(dispatch, getState);
        if (isPromise(promise)) {
          promises.push(promise);
          promise.then(noop, noop).then(() => {
            const index = promises.indexOf(promise);
            if (index !== -1) {
              promises.splice(index, 1);
            }
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
