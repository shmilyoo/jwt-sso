'use strict';
// 各个第三方系统在本系统进行注册，获取认证密码，认证密码保存在本系统和各第三方系统，每对密码
// 均不同。密码用来授权时进行jwt加密使用。
// 为了避免重放攻击等风险，token有效期可以设置短一点，比如5-10秒。所以如果这样的话，应进行
// 时间同步，可以本系统作为时间同步服务器

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, CHAR } = app.Sequelize;

  const Sso = db.defineModel(app, 'sso', {
    name: { type: STRING }, // 系统名称
    symbol: { type: STRING(16), unique: true }, // 系统代号，数字字母
    code: { type: STRING(16) }, // 认证密码
    intro: { type: STRING, allowNull: true }, // 系统介绍
  });

  return Sso;
};
