'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, CHAR } = app.Sequelize;

  const WorkExp = db.defineModel(app, 'exp', {
    userId: { type: CHAR(32) },
    type: { type: STRING(16) }, // 类别，education or work
    from: { type: INTEGER }, // 起始日期
    to: { type: INTEGER, allowNull: true }, // 结束日期 null 代表至今
    place: { type: STRING(32) }, // 地点，所在省市
    organization: { type: STRING(32) }, // 工作单位
    authenticator: { type: STRING(16), defaultValue: '' }, // 证明人
  });

  // Exp.associate = function() {
  //   Exp.belongsTo(app.model.User, {
  //     constrains: false,
  //     foreignKey: 'userId',
  //   });
  // };

  return WorkExp;
};
