'use strict';

const Controller = require('egg').Controller;

class SsoController extends Controller {
  async getAll() {
    const ssoList = await this.service.sso.getAll();
    this.ctx.body = this.ctx.helper.getRespBody(true, ssoList);
  }

  async addSso() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    await ctx.model.Sso.create(body);
    const ssoList = await this.service.sso.getAll();
    ctx.body = this.ctx.helper.getRespBody(true, ssoList);
  }

  async updateSso() {
    const ctx = this.ctx;
    const values = ctx.request.body;
    const id = values.id;
    delete values.id;
    await ctx.model.Sso.update(values, { where: { id } });
    const ssoList = await this.service.sso.getAll();
    ctx.body = this.ctx.helper.getRespBody(true, ssoList);
  }

  async deleteSso() {
    const ctx = this.ctx;
    const { id } = ctx.request.body;
    await ctx.model.Sso.destroy({ where: { id } });
    const ssoList = await this.service.sso.getAll();
    ctx.body = this.ctx.helper.getRespBody(true, ssoList);
  }
}

module.exports = SsoController;
