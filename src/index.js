import isPromise from './utils/isPromise';

export default () => {
  const promises = [];

  const promisesMiddleware = ({ dispatch, getState }) => {
    return (next) => (action) => {
      if (typeof action === 'function') {
        const promise = action(dispatch, getState);
        if (isPromise(promise)) {
          promises.push(promise);
        }
        return promise;
      } else {
        return next(action);
      }
    };
  };

  promisesMiddleware.then = (onResolved, onRejected) => {
    return Promise.all(promises).then(onResolved, onRejected);
  };

  return promisesMiddleware;
};
