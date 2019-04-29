'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

class CommonService extends Service {
  /**
   *
   * @param {string} password 用户发送的已经哈希后的密码
   * @param {string} username 用户名
   * @return {string} 存入数据库的加盐后哈希的密码，生产中应使用更安全的加密方法
   */
  async getCryptoPasswd(password, username) {
    const usernameMd5 = crypto
      .createHash('md5')
      .update(username)
      .digest('hex');
    const salt = this.config.salt + usernameMd5;
    return crypto
      .createHash('md5')
      .update(password + salt)
      .digest('hex');
  }

  async sleep(seconds) {
    await new Promise(resolve => {
      setTimeout(resolve, seconds * 1000);
    });
  }
}

module.exports = CommonService;
