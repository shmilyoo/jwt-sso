'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const User = db.defineModel(app, 'user', {
    username: { type: STRING(16), unique: true }, // 用户名
    password: { type: STRING }, // 密码
    name: { type: STRING(8), defaultValue: '' }, // 姓名
    sex: { type: INTEGER.UNSIGNED, defaultValue: 0 }, // 用户性别：1男性, 2女性, 0未知
    birthday: { type: INTEGER, defaultValue: 0 }, // 生日 Unix时间戳,秒， 0默认'1970-01-01',int会有2038问题，可以用bigint
    active: { type: INTEGER, defaultValue: 1 }, // 账户状态: 0正常，1未激活,2禁用
    deptId: { type: CHAR(32), defaultValue: '0' },
    nation: { type: STRING(8), defaultValue: '' }, // 民族
    idCard: { type: STRING(32), defaultValue: '' }, // 身份证号
    idCard2: { type: STRING(32), defaultValue: '' }, // 第二个证件号
    nativePlace: { type: STRING(16), defaultValue: '' }, // 籍贯
    enrollmentPlace: { type: STRING(16), defaultValue: '' }, // 入伍地
    enrollmentDate: { type: INTEGER, defaultValue: 0 }, // 入伍时间
    birthPlace: { type: STRING(16), defaultValue: '' }, // 出生地
    familyOrigin: { type: STRING(16), defaultValue: '' }, // 家庭出身
    selfOrigin: { type: STRING(16), defaultValue: '' }, // 本人成分
    politicalVisage: { type: STRING(16), defaultValue: '' }, // 政治面貌
    partyDate: { type: INTEGER, defaultValue: 0 }, // 党团时间
    phone: { type: STRING(32), defaultValue: '' },
    married: { type: BOOLEAN, defaultValue: false }, // 婚否
    onService: { type: BOOLEAN, defaultValue: true }, // 是否现役
  });

  User.associate = function() {
    User.belongsTo(app.model.Dept, {
      as: 'dept',
      foreignKey: 'deptId',
      constraints: false,
    });
    // User.belongsToMany(app.model.Sso, {
    //   as: 'ssos',
    //   constraints: false,
    //   through: app.model.UserSso,
    //   foreignKey: 'userId',
    //   otherKey: 'sso_id',
    // });
    User.hasMany(app.model.UserBind, {
      as: 'binds',
      foreignKey: 'userId',
      constraints: false,
    });
    // User.hasMany(app.model.Exp, {
    //   as: 'educations',
    //   foreignKey: 'userId',
    //   constraints: false,
    //   scope: {
    //     type: 'education',
    //   },
    // });
  };

  return User;
};
