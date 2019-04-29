'use strict';

const Controller = require('egg').Controller;

class DeptController extends Controller {
  async getAll() {
    const depts = await this.service.dept.getAllDepts();
    // 后台只负责返回按照level order 排序的列表，组成树状结构由前台负责
    // const deptTree = this.service.dept.makeDeptTree(depts);
    this.ctx.body = this.ctx.helper.getRespBody(true, depts);
  }

  async addDept() {
    const ctx = this.ctx;
    const { name, intro, parentId, symbol } = ctx.request.body;
    // 由于sid是自动增长的列，如果需要同步的话，等插入的行返回对象后，
    // 按照对象的sid来手动构建sql同步，尽量避免遇到极端情况下sid不同的问题
    // 同时，此类涉及unique键的管理插入操作应尽可能在中心服务器进行，才可彻底避免同步冲突
    await ctx.service.dept.addDept(name, intro, symbol, parentId);
    ctx.body = ctx.helper.getRespBody(true);
  }

  /**
   * 更新一行dept，body中必须包含id，其他键为表中的其他列,所以body中key必须和数据表中保持一致
   */
  async updateDept() {
    const ctx = this.ctx;
    const { id, name, intro } = ctx.request.body;
    const result = await ctx.model.Dept.update(
      { name, intro },
      { where: { id } }
    );
    if (result.length && result[0]) {
      await ctx.service.dept.refreshDeptUpdateTime();
      ctx.body = ctx.helper.getRespBody(true, result[0]);
    } else {
      ctx.body = ctx.helper.getRespBody(false, '更新失败,');
    }
  }

  async deleteDept() {
    const ctx = this.ctx;
    const { idList } = ctx.request.body;
    // result 为作用到的数据表行数
    const result = await ctx.model.Dept.destroy({
      where: { id: { [ctx.model.Op.in]: idList } },
    });
    result && (await ctx.service.dept.refreshDeptUpdateTime());
    ctx.body = ctx.helper.getRespBody(
      !!result,
      result ? result : '没有删除任何条目'
    );
  }

  async moveDept() {
    const ctx = this.ctx;
    const { id, parentId, compeer } = ctx.request.body;
    const result = await ctx.service.dept.moveDept(id, parentId, compeer);
    ctx.body = ctx.helper.getRespBody(result, result ? result : '移动失败');
  }

  async getDept() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    let data = null;
    if (ctx.query.withParent) {
      // 返回单个对象 {id,name,...,parent:{}}
      const dept = await ctx.service.dept.getDeptWithParent(id);
      data = dept;
    } else if (ctx.query.withAncestor) {
      const depts = await ctx.service.dept.getDeptWithAncestor(id);
    } else if (ctx.query.withChildren) {
      const depts = await ctx.service.dept.getDeptWithChildren(id);
    } else if (ctx.query.withOffspring) {
      // 返回数组 [{this dept},{child},{grand son}...] 按照level和order排列
      const depts = await ctx.service.dept.getDeptWithOffspring(id);
      data = depts;
    }
    ctx.body = ctx.helper.getRespBody(true, data);
  }

  async checkSymbol() {
    const ctx = this.ctx;
    const symbol = ctx.params.symbol;
    const count = await ctx.model.Dept.count({ where: { symbol } });
    ctx.body = ctx.helper.getRespBody(true, count);
  }
}

module.exports = DeptController;
