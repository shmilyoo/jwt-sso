// 定义数据库表的一些规范,辅助定义函数
'use strict';

const { generateUUID } = require('./utils');

/**
 *
 * @param {*} app egg app instance
 * @param {string} name table name
 * @param {Object} attributes table columns
 * @param {Object} option sequelize define option,merge with defaultOption in method
 * @param {bool} isIdPrimaryKey the default uuid field id is primary key or not
 * @return {*} sequelize model definition
 */
function defineModel(app, name, attributes, option, isIdPrimaryKey = true) {
  const defaultOption = {
    timestamps: false,
    version: false,
    freezeTableName: true,
  };
  const { CHAR } = app.Sequelize;
  const attrs = {};
  for (const key in attributes) {
    const value = attributes[key];
    if (typeof value === 'object' && value.type) {
      value.allowNull = value.allowNull || false;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
        allowNull: false,
      };
    }
  }
  attrs.id = {
    type: CHAR(32),
    primaryKey: isIdPrimaryKey,
    allowNull: false,
    defaultValue: () => {
      return generateUUID();
    },
  };
  return app.model.define(name, attrs, Object.assign(defaultOption, option));
}

module.exports = { defineModel };
