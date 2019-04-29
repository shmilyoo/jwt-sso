/**
 * 部分不需要app ctx上下文的工具方法
 */
'use strict';

const uuidv1 = require('uuid/v1');

exports.generateUUID = () => {
  return uuidv1().replace(/-/g, '');
};
