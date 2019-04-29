'use strict';
// 第三方系统A可以直接注册登录，登陆后，用户需要绑定sso用户进行实名，这里存储了这个绑定关系。
// 第三方用户在本系统内进行绑定，然后申请。用户需要到sso进行允许绑定操作。

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, CHAR, BOOLEAN } = app.Sequelize;

  const UserBind = db.defineModel(
    app,
    'userBind',
    {
      userId: { type: CHAR(32) },
      ssoSymbol: { type: CHAR(16) }, // 系统symbol,对应sso表
      ssoUsername: { type: STRING(16) }, // 第三方系统的用户名
      agreed: { type: BOOLEAN, defaultValue: false }, // sso 系统用户是否已经同意授权绑定
    },
    {
      // 一个cas用户在一个第三方系统内只能绑定一个用户
      // 一个第三方系统的用户名只能绑定一个cas用户
      indexes: [
        { unique: true, fields: [ 'userId', 'ssoSymbol' ] },
        { unique: true, fields: [ 'ssoSymbol', 'ssoUsername' ] },
      ],
    }
  );

  UserBind.associate = function() {
    UserBind.belongsTo(app.model.User, {
      as: 'user',
      foreignKey: 'userId',
      constraints: false,
    });
  };

  return UserBind;
};
