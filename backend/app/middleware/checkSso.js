'use strict';

const jwt = require('jsonwebtoken');

module.exports = (options, app) => {
  // 用户在第三方站点有cookie，在首次访问时，第三方站点把相关信息发送到sso进行验证
  return async function checkSso(ctx, next) {
    // 验证token是否有效
    // const { symbol } = ctx.request.body;
    // 第三方系统的symbol 从 token的数据中获取
    const _token = ctx.service.auth.getAuthTokenSync() || '';
    const symbol = (jwt.decode(_token) || {}).symbol;
    if (!symbol) {
      ctx.body = ctx.helper.getRespBody(
        false,
        '请在请求头中包含令牌进行验证，且令牌中必须有symbol字段'
      );
      return;
    }
    const sso = await ctx.service.sso.getSsoBySymbol(symbol);
    if (!sso) {
      ctx.body = ctx.helper.getRespBody(
        false,
        '第三方系统未在统一登录系统注册'
      );
      return;
    }
    const checkResult = await ctx.service.auth.checkAuthToken(sso.code, _token);
    if (typeof checkResult === 'string') {
      ctx.body = ctx.helper.getRespBody(false, checkResult);
      return;
    }
    ctx.sso = sso;
    ctx.tokenData = checkResult;
    await next();
  };
};
