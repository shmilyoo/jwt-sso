'use strict';

const Service = require('egg').Service;

class SsoService extends Service {
  async getAll() {
    const ssoList = await this.ctx.model.Sso.findAll({
      order: [ 'symbol' ],
      raw: true,
    });
    return ssoList;
  }

  /**
   * 尝试从缓存获取第三方系统的信息，若不存在则从数据库中获取并更新缓存
   * @param {string} symbol sso 第三方系统的symbol
   * @return {object} 第三方系统sso对象
   */
  async getSsoBySymbol(symbol) {
    let sso = await this.ctx.app.redis.get(`sso:sso:${symbol}`);
    if (sso) {
      return JSON.parse(sso);
    }
    sso = await this.ctx.model.Sso.findOne({
      where: { symbol },
      raw: true,
    });
    if (sso) {
      await this.ctx.app.redis.set(`sso:sso:${symbol}`, JSON.stringify(sso));
    }
    return sso;
  }

  async updateSsoCache(sso) {
    await this.ctx.app.redis.set(`sso:sso:${sso.symbol}`, JSON.stringify(sso));
  }
}

module.exports = SsoService;
