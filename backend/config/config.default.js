'use strict';

exports.keys = 'jwt-sso-backend_1534471453595_4522';
exports.middleware = [];
exports.sequelize = {
  dialect: 'mysql',
  hostname: 'localhost',
  port: 3306,
  database: 'sso',
  username: 'root',
  password: 'root',
};
exports.redis = {
  client: {
    host: '127.0.0.1',
    port: 6379,
    password: null,
    db: '0',
  },
  agent: true,
};
exports.logger = {
  dir: '/var/log/jwt-sso-backend',
};
exports.security = {
  // domainWhiteList: [ 'http://localhost:3000' ],
  csrf: {
    enable: false,
  },
};
exports.cors = {
  // 对于附带身份凭证的请求(即服务器设置Access-Control-Allow-Credentials: true)，
  // 服务器不得设置 Access-Control-Allow-Origin 的值为“*”。否则请求将会失败。
  origin: 'http://localhost:3000',
  credentials: true,
  allowMethods: 'GET,POST,PUT,HEAD,DELETE,OPTIONS',
  maxAge: 3600 * 24,
};
exports.onerror = {
  all(err, ctx) {
    ctx.body = { success: false, error: `发生错误，${err.message}` };
    ctx.status = 200;
  },
};
exports.cluster = {
  listen: { port: 8001 },
};
exports.jwtSecrect = 'qwert12345yuiop54321';
exports.salt = 'dsioiwerfdsafsdkl#4343@kfd'; // 用户密码加盐 md5(md5-password+salt)
exports.usernameBlackList = [ 'admin' ]; // 不允许注册的用户名
