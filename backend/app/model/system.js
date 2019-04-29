'use strict';
// 系统一些配置项信息,使用 name -value 方式存储
// deptUpdateTime : `${Math.floor(new Date().getTime() / 1000)}`  unix时间戳秒数的字符串表示

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, CHAR } = app.Sequelize;

  const System = db.defineModel(app, 'system', {
    name: { type: STRING, unique: true }, // 配置项名称
    value: { type: STRING(64) }, // 配置项的值，一律使用string存储
  });

  return System;
};
