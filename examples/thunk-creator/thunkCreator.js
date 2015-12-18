// re-usable asynchronous thunk creator
// https://github.com/rackt/redux/issues/99#issuecomment-112212639
export default (action) => {
  const { types, promise, ...rest } = action;
  const [ REQUESTED, RESOLVED, REJECTED ] = types;

  return (dispatch) => {
    dispatch({ ...rest, type: REQUESTED });

    return promise.then(
      (result) => dispatch({ ...rest, type: RESOLVED, result }),
      (error) => dispatch({ ...rest, type: REJECTED, error })
    );
  };
};
