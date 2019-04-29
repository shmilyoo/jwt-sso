'use strict';

module.exports = (options, app) => {
  return async function checkAdmin(ctx, next) {
    await next();
  };
};
