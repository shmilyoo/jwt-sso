'use strict';

const Service = require('egg').Service;

class DeptService extends Service {
  async getAllDepts() {
    const depts = await this.ctx.model.Dept.findAll({
      order: [ 'level', 'order' ],
      raw: true,
    });
    return depts;
  }

  async addDept(name, intro, symbol, parentId = '0') {
    // path level 计算出来
    let path = '';
    let level = 1;
    let order = 1;
    const Dept = this.ctx.model.Dept;
    if (parentId !== '0') {
      // 不是根节点，需要计算path和level，根据其父节点。另外根据兄弟节点计算order
      const parent = await Dept.findOne({
        include: [
          {
            model: Dept,
            as: 'children',
            attributes: [ 'order' ],
            // duplicating: false,
          },
        ],
        attributes: [ 'path', 'level', 'symbol' ],
        where: { id: parentId },
        order: [[ 'children', 'order', 'DESC' ]],
        raw: true,
      });
      path = `${parent.path}${parent.symbol}-`;
      level = parent.level + 1;
      order = parent['children.order'] ? parent['children.order'] + 1 : 1;
    } else {
      // 添加节点是根节点，需要根据其他根节点最大的order计算其order
      const maxBro = await Dept.max('order', { where: { level: 1 } });
      order = maxBro ? maxBro + 1 : 1;
    }
    const dept = await Dept.create({
      name,
      intro,
      symbol,
      parentId,
      path,
      order,
      level,
    });
    dept && (await this.refreshDeptUpdateTime());
    return dept;
  }

  async moveDept(id, parentId, compeer) {
    const ctx = this.ctx;
    const Dept = ctx.model.Dept;
    const index = compeer.indexOf(id);
    const transaction = await ctx.model.transaction();
    let result = null;
    try {
      const newParentAndNode = await Dept.findAll({
        attributes: [ 'id', 'path', 'symbol', 'level' ],
        where: { id: { [ctx.model.Op.in]: [ id, parentId ] } },
        raw: true,
      });
      let node;
      let parent;
      for (const n of newParentAndNode) {
        if (n.id === id) node = n;
        if (n.id === parentId) parent = n;
      }
      // 当移动节点到根节点的时候，是特殊情况
      if (parentId === '0') {
        parent = { level: 0, newNodePath: '' };
      } else {
        parent.newNodePath = `${parent.path}${parent.symbol}-`;
      }
      if (!(node && parent)) throw '错误的移动节点信息';
      if (index === 0) {
        // 在新的同级别dept中在第一位，将所有其他同级别node的order+1
        await Dept.update(
          { order: ctx.model.literal('`order` +1') },
          { where: { parentId }, transaction }
        );
        // 将新的node设置为order 1,以及自己的新parent
        await Dept.update(
          {
            parentId,
            order: 1,
            level: parent.level + 1,
            path: parent.newNodePath,
          },
          { where: { id }, transaction }
        );
      } else {
        // 在新的同级别node中非第一位，找到前一个node的order，设置自己order为其+1，其后所有的顺序+1
        const preDept = await Dept.findOne({
          attributes: [ 'order' ],
          where: { id: compeer[index - 1] },
          raw: true,
        });
        // 其后所有的node 的 order顺序+1
        await Dept.update(
          { order: ctx.model.literal('`order`+1') },
          {
            where: {
              parentId,
              order: { [ctx.model.Op.gt]: preDept.order },
            },
            transaction,
          }
        );
        // 设置自己order为前一个node的order+1，以及自己的新parent
        await Dept.update(
          {
            parentId,
            order: preDept.order + 1,
            level: parent.level + 1,
            path: parent.newNodePath,
          },
          { where: { id }, transaction }
        );
      }
      // 将自身的所有子孙节点的path
      // 相应修改 ${node.path}${node.symbol}- 替换为${parent.path}${parent.symbol}-${node.symbol}-
      // 替换 ${node.path} 为 ${parent.path}${parent.symbol}-的话，要考虑node.path为空
      // 修改新的level += parent.level+1-node.level
      const prePath = `${node.path}${node.symbol}-`;
      const newPath = `${parent.newNodePath}${node.symbol}-`;
      const newLevelStep = parent.level + 1 - node.level;
      const prePathLike = prePath + '%';
      result = await ctx.model.query(
        'update `dept` set `path`=concat(:newPath,substr(`path`,length(:prePath)+1)),`level`=`level`+:newLevelStep where `path` like :prePathLike',
        {
          replacements: { prePath, newPath, newLevelStep, prePathLike },
          transaction,
        }
      );
      await this.refreshDeptUpdateTime();
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      result = null;
    }
    return !!result;
  }

  /**
   *
   * @param {Array} deptArray 按照level从小到大排列的dept object数组
   * @return {Array} 符合react-sortable-tree数据格式的数组
   */
  makeDeptTree(deptArray) {
    // [{name,intro,parent,path,level,id,symbol},{},{}]
    const result = [];
    const tmp = {};
    for (let i = 0; i < deptArray.length; i++) {
      const dept = deptArray[i];
      tmp[dept.id] = { title: dept.name, id: dept.id };
      if (dept.parent !== '0') {
        tmp[dept.parent].children
          ? tmp[dept.parent].children.push(tmp[dept.id])
          : (tmp[dept.parent].children = [ tmp[dept.id] ]);
      } else {
        result.push(tmp[dept.id]);
      }
    }
    return result;
  }

  /**
   * 获取节点以及父节点
   * @param {string} id dept id
   * @return {object} {id,name,...,parent:{}}
   */
  async getDeptWithParent(id) {
    // 如果使用raw:true 返回的是{id,name,...,parent.id,parent.name...}
    // raw:false 后http自动返回的data是 {id,name,...,parent:{}}
    const Dept = this.ctx.model.Dept;
    const dept = await Dept.findOne({
      where: { id },
      include: [{ model: Dept, as: 'parent' }],
    });
    return dept;
  }

  /**
   * 获取节点以及所有祖先节点,按照level从小到大排列，最后一个是对应id的dept
   * @param {string} id dept id
   * @return {array} dept and ancestors order with level
   */
  async getDeptWithAncestor(id) {
    const Dept = this.ctx.model.Dept;
    const dept = await Dept.findOne({
      where: { id },
      attributes: [ 'symbol', 'path' ],
      raw: true,
    });
    if (!dept) {
      return [];
    }
    const symbols = (dept.path + dept.symbol).split('-');
    const depts = await Dept.findAll({
      where: { symbol: { [this.ctx.model.Op.in]: symbols } },
      order: [ 'level' ],
      raw: true,
    });
    return depts;
  }

  /**
   * 获取节点以及一级子节点
   * @param {string} id dept id
   */
  async getDeptWithChildren(id) {}

  /**
   * 获取节点以及所有后代节点order with level and order
   * @param {string} id dept id
   * @return {array} dept and Offspring order with level and order
   */
  async getDeptWithOffspring(id) {
    const Dept = this.ctx.model.Dept;
    const dept = await Dept.findOne({
      where: { id },
      raw: true,
    });
    if (!dept) {
      return [];
    }
    const depts = await Dept.findAll({
      where: {
        path: { [this.ctx.model.Op.like]: `${dept.path}${dept.symbol}-%` },
      },
      order: [ 'level', 'order' ],
      raw: true,
    });
    return [ dept, ...depts ];
  }

  async refreshDeptUpdateTime() {
    await this.ctx.model.System.upsert({
      name: 'deptUpdateTime',
      value: `${Math.floor(new Date().getTime() / 1000)}`,
    });
  }
}

module.exports = DeptService;
