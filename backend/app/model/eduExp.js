'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, CHAR } = app.Sequelize;

  const EduExp = db.defineModel(app, 'exp', {
    userId: { type: CHAR(32) },
    name: { type: STRING(16) }, // 名称，小学 中学 高中 本科 研究生等
    from: { type: INTEGER }, // 起始日期
    to: { type: INTEGER, allowNull: true }, // 结束日期 null 代表至今
    school: { type: STRING(32) }, // 教育经历所在地点
    degree: { type: STRING(16), defaultValue: '' }, // 学位
    major: { type: STRING(32), defaultValue: '' }, // 所学专业
    authenticator: { type: STRING(16), defaultValue: '' }, // 证明人
  });

  return EduExp;
};
