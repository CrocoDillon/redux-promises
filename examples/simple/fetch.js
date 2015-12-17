// simple mock for fetch with a 100ms response time
export default (url) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Result for '${url}'`);
    }, 100);
  });
};
