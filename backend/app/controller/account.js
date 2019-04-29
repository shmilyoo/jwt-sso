'use strict';

const Controller = require('egg').Controller;
const jwt = require('jwt-simple');

class AccountController extends Controller {
  async reg() {
    const { ctx, config } = this;
    const body = ctx.request.body;
    let { username, password } = body;
    username = username.toLowerCase();
    if (config.usernameBlackList.includes(username)) {
      ctx.body = ctx.helper.getRespBody(false, '非法的用户名');
    } else {
      password = await this.service.common.getCryptoPasswd(password, username);
      await ctx.model.User.create({ username, password });
      ctx.body = ctx.helper.getRespBody(true, { username });
    }
  }

  /**
   * 用户注册时后台异步验证用户名是否已经占用/是否可用
   */
  async checkUser() {
    const ctx = this.ctx;
    const username = ctx.params.username.toLowerCase();
    const user = await ctx.model.User.findOne({ where: { username } });
    ctx.body = ctx.helper.getRespBody(true, {
      isNameExist: !!user,
    });
  }

  /**
   * //用户首次加载网页，若本地有cookie，则发送认证请求到服务器
   * 暂时取消此方法，相关功能在中间件实现
   */
  async auth() {
    // 已经经过中间件checkUser验证，直接返回true即可
    const ctx = this.ctx;
    ctx.body = ctx.helper.getRespBody(true, ctx.user);
  }

  async basicInfo() {
    const ctx = this.ctx;
    // const {} = ctx.request.body;
    const userId = ctx.user.id;
    const userInfo = await ctx.service.account.getBasicInfo(userId);
    ctx.body = ctx.helper.getRespBody(
      !!userInfo,
      userInfo ? userInfo : '找不到对应的用户信息'
    );
  }

  async updateBasicInfo() {
    const ctx = this.ctx;
    const {
      birthday,
      married,
      sex,
      idCard,
      idCard2,
      name,
      nation,
      nativePlace,
      phone,
      dept: { id: deptId },
    } = ctx.request.body;
    const userId = ctx.user.id;
    const response = await ctx.model.User.update(
      {
        birthday,
        married,
        sex,
        idCard,
        idCard2,
        name,
        nation,
        nativePlace,
        phone,
        deptId,
        active: 0, // 未激活用户在完善基本信息后完成激活
      },
      { where: { id: userId } }
    );
    if (response && response.length > 0 && response[0] > 0) {
      ctx.body = ctx.helper.getRespBody(true);
    } else {
      ctx.body = ctx.helper.getRespBody(false, '更新失败');
    }
  }

  async getExp() {
    const ctx = this.ctx;
    const kind = ctx.params.kind;
    let model = null;
    if (kind === 'work') model = ctx.model.WorkExp;
    else if (kind === 'edu') model = ctx.model.EduExp;
    else throw '不存在的经验类型';
    const response = await model.findAll({
      where: { userId: ctx.user.id },
    });
    ctx.body = ctx.helper.getRespBody(true, response);
  }
  async setExp() {
    const ctx = this.ctx;
    const kind = ctx.params.kind;
    let model = null;
    if (kind === 'work') model = ctx.model.WorkExp;
    else if (kind === 'edu') model = ctx.model.EduExp;
    else throw '不存在的经验类型';
    const userId = ctx.user.id;
    const values = ctx.request.body;
    values.forEach(exp => {
      exp.to = exp.to || null;
      exp.userId = userId;
    });
    const transaction = await ctx.model.transaction();
    try {
      await model.destroy({
        where: { userId },
        transaction,
      });
      await model.bulkCreate(values, { transaction });
      await transaction.commit();
      const newExps = await model.findAll({
        where: { userId },
        order: [ 'from' ],
      });
      ctx.body = ctx.helper.getRespBody(true, newExps);
    } catch (error) {
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false, `保存失败-${error.message}`);
    }
  }

  async login() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    const { username, password, remember } = body;
    // remember = remember === 'true'; // qs编码的form格式bodyparser解析boolean为string
    const user = await ctx.service.account.checkUserPasswd(username, password);
    if (user) {
      // 登录认证通过，设置cookie，服务端session
      const [ expires, maxAge ] = ctx.helper.getExpiresAndMaxAge('week', 1);
      await ctx.service.account.setCache(user, maxAge, remember);
      await ctx.service.account.setCookie(user, maxAge, expires, remember);
      // todo 修改redis本地缓存信息
      ctx.body = ctx.helper.getRespBody(true, {
        id: user.id,
        username: user.username,
        active: user.active,
      });
    } else {
      ctx.body = ctx.helper.getRespBody(false, '用户名或密码不正确');
    }
  }

  async logout() {
    const ctx = this.ctx;
    await ctx.app.redis.del(`sso:user:${ctx.user.id}`);
    ctx.helper.setCookie('uid', '');
    ctx.helper.setCookie('username', '');
    ctx.helper.setCookie('active', '');
    ctx.body = ctx.helper.getRespBody(true);
  }
}

module.exports = AccountController;
