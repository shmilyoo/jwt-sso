'use strict';

const Controller = require('egg').Controller;
const generateUUID = require('../utils').generateUUID;

class HomeController extends Controller {
  async index() {
    this.app;
    this.ctx.session.aaa = { bb: 12 };
    this.ctx.session.bbb = { bbbbb: 1223 };
    this.ctx.body = { id: generateUUID() };
    this.ctx.logger.info(this.app.config.env);
    this.ctx.logger.info(process.pid);
    this.ctx.body = this.ctx.helper.getRespBody(true);
  }
  async test() {
    const ctx = this.ctx;
    const result = await ctx.model.Dept.destroy({
      where: { id: 'c360d5f0ceef11e8b013f53754442dd4' },
    });
    result && (await ctx.service.dept.refreshDeptUpdateTime());
    ctx.body = ctx.helper.getRespBody(
      !!result,
      result ? result : '没有删除条目'
    );
  }
}

module.exports = HomeController;
