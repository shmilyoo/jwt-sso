'use strict';

const Controller = require('egg').Controller;

class ApiController extends Controller {
  async deptArray() {
    const ctx = this.ctx;
    const { time } = ctx.query;
    const res = await ctx.model.System.findOne({
      where: { name: 'deptUpdateTime' },
    });
    if (time && res && res.value === time) {
      ctx.body = ctx.helper.getRespBody(true, { hasChanged: false });
      return;
    }
    const deptArray = await ctx.service.dept.getAllDepts();
    ctx.body = ctx.helper.getRespBody(true, {
      hasChanged: true,
      deptArray,
      time: res.value,
    });
  }
}

module.exports = ApiController;
