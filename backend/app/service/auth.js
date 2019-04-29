'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const util = require('util');

class AuthService extends Service {
  async checkAuthToken(key, token) {
    try {
      const data = jwt.verify(token, key);
      return data;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return 'token已经过期，请从原系统重新进入';
      }
      if (error instanceof jwt.JsonWebTokenError) return 'token不正确';
      return `token验证发生未知错误，error:${error}`;
    }
  }

  async checkCacheSso(userId, symbol) {
    const cacheStr = await this.ctx.app.redis.get(`sso:user:${userId}`);
    if (!cacheStr) return false;
    const cache = JSON.parse(cacheStr);
    if (cache && cache.auth && cache.auth.includes(symbol)) return true;
    return false;
  }

  getAuthTokenSync() {
    const ctx = this.ctx;
    const authInHeaders = ctx.request.headers.authorization;
    const _token = authInHeaders
      ? authInHeaders.split(' ')[1]
      : ctx.request.body.token;
    return _token;
  }

  async getUserWithAuth(username, password, sso_id) {
    username = username.toLowerCase();
    password = await this.service.common.getCryptoPasswd(password, username);
    const user = await this.ctx.model.User.findOne({
      include: [
        {
          model: this.ctx.model.Sso,
          as: 'ssos',
          where: { id: sso_id },
          required: false,
        },
      ],
      attributes: [ 'id', 'username', 'password', 'active' ],
      where: { username, password },
    });
    return user;
  }

  async getUserBinds(userId) {
    const userBinds = await this.ctx.model.UserBind.findAll({
      where: { userId },
      raw: true,
    });
    return userBinds;
  }
}

module.exports = AuthService;
