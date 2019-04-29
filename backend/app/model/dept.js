'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, DATE, DATEONLY, BOOLEAN, CHAR } = app.Sequelize;

  const Dept = db.defineModel(
    app,
    'dept',
    {
      symbol: { type: STRING(16) }, // 用在path里面，直接用uuid太长了
      name: { type: STRING(32) }, // 部门名称，可重复
      intro: { type: STRING(64), defaultValue: '' }, // 部门简介
      parentId: { type: CHAR(32) }, // 父节点id，根节点的父节点为 '0'*32
      path: { type: STRING }, // 路径，根节点为''，其他节点为`${parent.path}${parent.id}-`
      level: { type: INTEGER }, // 节点深度，根节点为1，以下递增1
      order: { type: INTEGER, defaultValue: 1 }, // 兄弟节点的排序，数字越小越优先
    },
    { indexes: [{ unique: true, fields: [ 'symbol' ] }] }
  );

  Dept.associate = function() {
    Dept.hasMany(Dept, {
      as: 'children',
      foreignKey: 'parentId',
      constraints: false,
    });
    Dept.belongsTo(Dept, {
      as: 'parent',
      foreignKey: 'parentId',
      targetKey: 'id',
      constraints: false,
    });
    // Dept.hasMany(app.model.User, {
    //   as: 'crew',
    //   foreignKey: 'deptId',
    //   constraints: false,
    // });
  };

  return Dept;
};
