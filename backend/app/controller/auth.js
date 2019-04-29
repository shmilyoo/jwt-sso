'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');

class AuthController extends Controller {
  async login() {
    const ctx = this.ctx;
    const {
      username,
      password,
      remember,
      from,
      redirect,
      token,
    } = ctx.request.body;
    const sso = await this.service.sso.getSsoBySymbol(from);
    if (!sso) {
      ctx.body = ctx.helper.getRespBody(
        false,
        '系统中找不到注册的第三方系统,请联系系统管理员'
      );
    }
    // 成功返回true，失败返回error message
    const check = await this.service.auth.checkAuthToken(sso.code, token);
    if (typeof check === 'string') {
      // 验证token失败
      ctx.body = ctx.helper.getRespBody(false, check);
      return;
    }
    const user = await ctx.service.account.checkUserPasswd(username, password);
    if (!user) {
      ctx.body = ctx.helper.getRespBody(false, '用户名密码不正确');
      return;
    }
    if (user.active !== 0) {
      ctx.body = ctx.helper.getRespBody(false, '用户没有激活或被禁用');
      return;
    }
    const [ expires, maxAge ] = ctx.helper.getExpiresAndMaxAge('week', 1);
    await ctx.service.account.setCache(user, maxAge, remember, sso.symbol);
    await ctx.service.account.setCookie(user, maxAge, expires, remember);
    const tokenReply = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 15,
        authType: 'sso',
        user: {
          id: user.id,
          active: user.active,
          sex: user.sex,
          deptId: user.deptId,
          name: user.name,
        },
        remember,
      },
      sso.code
    );
    ctx.body = ctx.helper.getRespBody(true, {
      token: tokenReply,
      redirect,
      id: user.id,
      active: user.active,
    });
  }

  /**
   * 第三方系统用户首次加载页面时，若有cookie，则其服务端发送给sso进行验证
   */
  async check() {
    const ctx = this.ctx;
    // { id, authType, symbol: sysName },
    const { id, authType } = ctx.request.body;
    const sso = ctx.sso;
    let user = null;
    if (authType === 'sso') {
      // 统一认证登录，验证cache
      if (await ctx.service.auth.checkCacheSso(id, sso.symbol)) {
        user = await ctx.model.User.findOne({
          where: { id },
          raw: true,
          attributes: [ 'username', 'active', 'name', 'sex', 'deptId' ],
        });
      } else {
        ctx.body = ctx.helper.getRespBody(false, '统一认证系统验证失败');
        return;
      }
    } else if (authType === 'local') {
      const userBind = await ctx.model.UserBind.findOne({
        include: [
          {
            model: ctx.model.User,
            as: 'user',
            attributes: [ 'username', 'active', 'name', 'sex', 'deptId' ],
          },
        ],
        where: { userId: id, ssoSymbol: sso.symbol },
      });
      if (userBind && !userBind.agreed) {
        ctx.body = ctx.helper.getRespBody(false, '统一认证系统未确定用户绑定');
        return;
      }
      if (!userBind) {
        ctx.body = ctx.helper.getRespBody(false, '统一认证系统不存在绑定关系');
        return;
      }
      user = userBind.user;
    } else {
      throw '错误的验证类型';
    }
    if (user.active) {
      // active为0为正常
      ctx.body = ctx.helper.getRespBody(false, '用户被禁用或者未激活');
      return;
    }
    user.id = id;
    ctx.body = ctx.helper.getRespBody(true, { authType, user });
  }

  /**
   * 第三方系统注册用户，申请绑定sso用户
   */
  async userBind() {
    // sysName: config.sysName,
    // casUsername: casUsername, // 需要绑定的cas用户名
    // username: username, // 第三方系统的用户名

    // userId: { type: CHAR(32), unique: 'userBindUnique' },
    // ssoSymbol: { type: CHAR(16), unique: 'userBindUnique' }, // 系统symbol,对应sso表
    // ssoUsername: { type: STRING(16) }, // 系统的用户名
    // agreed: { type: BOOLEAN, defaultValue: false }, // sso 系统用户是否已经同意授权绑定
    const ctx = this.ctx;
    const { sysName, casUsername, username } = ctx.request.body;
    const user = await ctx.model.User.findOne({
      where: { username: casUsername },
      include: [
        {
          as: 'binds',
          model: ctx.model.UserBind,
          where: { ssoSymbol: sysName },
          required: false,
        },
      ],
    });
    if (!user) {
      ctx.body = ctx.helper.getRespBody(false, '统一认证系统用户名不存在');
      return;
    }
    if (user.binds.length > 0) {
      ctx.body = ctx.helper.getRespBody(
        false,
        '统一认证系统用户和本系统已经存在绑定关系'
      );
      return;
    }
    try {
      await ctx.model.UserBind.create({
        userId: user.id,
        ssoSymbol: sysName,
        ssoUsername: username,
      });
      ctx.body = ctx.helper.getRespBody(true, {
        id: user.id,
        name: user.name,
        deptId: user.deptId,
      });
    } catch (error) {
      ctx.body = ctx.helper.getRespBody(
        false,
        `确保CAS用户${casUsername}与本系统用户不存在绑定关系，且本系统用户${username}在CAS不存在绑定关系`
      );
    }
  }

  async userBinds() {
    const ctx = this.ctx;
    const userBinds = await ctx.service.auth.getUserBinds(ctx.user.id);
    ctx.body = ctx.helper.getRespBody(true, userBinds);
  }

  async toggleUserBind() {
    const ctx = this.ctx;
    const { id, agreed } = ctx.request.body;
    if (agreed) {
      // 对于已经同意的，撤销申请，直接删除条目
      await ctx.model.UserBind.destroy({ where: { id } });
    } else {
      // 对于未同意的，同意申请
      await ctx.model.UserBind.update({ agreed: true }, { where: { id } });
    }
    const userBinds = await ctx.service.auth.getUserBinds(ctx.user.id);
    ctx.body = ctx.helper.getRespBody(true, userBinds);
  }

  async checkBind() {
    const ctx = this.ctx;
    const { userId, ssoUsername } = ctx.request.body;
    const ssoSymbol = ctx.sso.symbol;
    const userBind = await ctx.model.UserBind.findOne({
      include: [
        {
          model: ctx.model.User,
          as: 'user',
          attributes: [ 'username', 'active', 'name', 'sex', 'deptId' ],
        },
      ],
      where: { userId, ssoUsername, ssoSymbol },
    });
    if (!userBind) {
      ctx.body = ctx.helper.getRespBody(false, '尚未绑定统一认证系统用户');
    } else {
      if (!userBind.agreed) {
        ctx.body = ctx.helper.getRespBody(
          false,
          '统一认证系统用户尚未确认绑定'
        );
      } else if (userBind.user.active !== 0) {
        ctx.body = ctx.helper.getRespBody(
          false,
          userBind.user.active === 1
            ? '统一认证系统用户未激活'
            : '统一认证系统用户被禁用'
        );
      } else {
        ctx.body = ctx.helper.getRespBody(true, userBind);
      }
    }
  }
}

module.exports = AuthController;
