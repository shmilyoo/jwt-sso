'use strict';

module.exports = (options, app) => {
  return async function checkUser(ctx, next) {
    const id = ctx.helper.getCookie('uid');
    const username = ctx.helper.getCookie('username');
    const active = Number.parseInt(ctx.helper.getCookie('active'));
    const authInfo = JSON.parse(await app.redis.get(`sso:user:${id}`));
    if (
      authInfo &&
      authInfo.username === username &&
      authInfo.active === active
    ) {
      ctx.user = { id, active, username };
      await next();
    } else {
      // 验证失败，清除cookie，返回401错误
      ctx.helper.setCookie('uid', '');
      ctx.helper.setCookie('username', '');
      ctx.helper.setCookie('active', '');
      ctx.status = 401;
      ctx.body = ctx.helper.getRespBody(false, '用户认证失败');
    }
  };
};
