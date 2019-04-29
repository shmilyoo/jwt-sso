'use strict';

const md5 = require('md5');
const crypto = require('crypto');

const getCryptoPasswdSync = (password, username) => {
  const usernameMd5 = crypto
    .createHash('md5')
    .update(username)
    .digest('hex');
  const salt = 'dsioiwerfdsafsdkl#4343@kfd' + usernameMd5;
  return crypto
    .createHash('md5')
    .update(password + salt)
    .digest('hex');
};

module.exports = app => {
  app.logger.info('应用启动，进程id： ' + process.pid);
  if (app.config.env === 'local' || app.config.env === 'unittest') {
    app.beforeStart(async () => {
      app.logger.info('开始同步数据库表');
      await app.model.sync({ force: true });
      const jsb = await app.model.Dept.create({
        id: 'c360d5f0ceef11e8b013f53754442aa4',
        symbol: 'jsb',
        name: '技术部',
        intro: '技术部',
        // parent: Array(33).join('0'),
        parentId: '0',
        path: '',
        level: 1,
      });
      const jsb4s = await app.model.Dept.create({
        id: 'c360d5f0ceef11e8b013f53754442dd4',
        symbol: 'jsb4s',
        name: '四室',
        intro: '技术部四室',
        // parent: Array(33).join('0'),
        parentId: jsb.id,
        path: 'jsb-',
        order: 1,
        level: 2,
      });
      const jsb4sztz = await app.model.Dept.create({
        id: 'c360d5f0ceef11e8b013f53754442dd5',
        symbol: '4sztz',
        name: '总体组',
        intro: '四室总体组',
        parentId: jsb4s.id,
        path: 'jsb-jsb4s-',
        order: 1,
        level: 3,
      });
      const jsb4swlz = await app.model.Dept.create({
        id: 'c360d5f0ceef11e8b013f53754442666',
        symbol: '4swlz',
        name: '网络组',
        intro: '四室网络组',
        parentId: jsb4s.id,
        path: 'jsb-jsb4s-',
        order: 2,
        level: 3,
      });
      const jsb4sboss1 = await app.model.User.create({
        id: 'c360d5f0ceef11e8b013f53754442777',
        username: 'aaaa',
        password: getCryptoPasswdSync(md5('aaaa'), 'aaaa'),
        name: '室领导1',
        sex: 1,
        birth: 12123443,
        active: 0,
        deptId: jsb4s.id,
      });
      const jsb4sboss2 = await app.model.User.create({
        username: 'bbbb',
        password: getCryptoPasswdSync(md5('bbbb'), 'bbbb'),
        name: '室领导2',
        sex: 2,
        birth: 2323232,
        active: 0,
        deptId: jsb4s.id,
      });
      const jsb4sztz1 = await app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da22bf',
        username: 'cccc',
        password: getCryptoPasswdSync(md5('cccc'), 'cccc'),
        name: '总体1',
        sex: 2,
        birth: 4333433,
        active: 0,
        deptId: jsb4sztz.id,
      });
      const jsb4sztz2 = await app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da67bf',
        username: 'dddd',
        password: getCryptoPasswdSync(md5('dddd'), 'dddd'),
        name: '总体2',
        nation: '汉族',
        married: true,
        sex: 2,
        birth: 4333433,
        idCard: 'card1',
        idCard2: 'card2',
        nativePlace: '安徽',
        phone: '232343434',
        active: 0,
        deptId: jsb4sztz.id,
      });
      const jsb4swlz1 = await app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da2222',
        username: 'eeee',
        password: '4d9c5cd1d4a5e30cb73522038a6946e1',
        name: '网络1',
        sex: 2,
        birth: 4333433,
        active: 0,
        deptId: jsb4swlz.id,
      });
      const jsb4swlz2 = await app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da2233',
        username: 'ffff',
        password: '4d9c5cd1d4a5e30cb73522038a6946e1',
        name: '网络2',
        sex: 2,
        birth: 4333433,
        active: 0,
        deptId: jsb4swlz.id,
      });
      const sso1 = await app.model.Sso.create({
        name: 'ims',
        symbol: 'ims',
        code: '111111',
        origins: 'http://localhost:3000',
        intro: '办公信息管理系统',
      });
      const sso2 = await app.model.Sso.create({
        name: 'sso2',
        symbol: 'sso2symbol',
        code: 'ad97$##@#@#asfd',
        origins: 'http://localhost:4000;http://localhost:5000',
        intro: '发的所发生的发生fsdfdsfdsfdsf',
      });
      await app.model.UserBind.create({
        userId: 'c360d5f0ceef11e8b013f53754442777',
        ssoSymbol: 'ims',
        ssoUsername: 'admin',
        agreed: true,
      });
      await app.model.UserBind.create({
        userId: 'f3762080cb9911e884eec9a890da22bf',
        ssoSymbol: 'ims',
        ssoUsername: 'cccc',
        agreed: true,
      });
      await app.model.UserBind.create({
        userId: 'f3762080cb9911e884eec9a890da67bf',
        ssoSymbol: 'ims',
        ssoUsername: 'dddd',
        agreed: true,
      });
      await app.model.UserBind.create({
        userId: 'f3762080cb9911e884eec9a890da2222',
        ssoSymbol: 'ims',
        ssoUsername: 'eeee',
        agreed: true,
      });
      await app.model.System.upsert({
        name: 'deptUpdateTime',
        value: `${Math.floor(new Date().getTime() / 1000)}`,
      });

      app.logger.info('同步数据库表完毕');
      // const test = await app.model.Dept.findOne({
      //   where: { level: 1 },
      //   // limit: 1,
      //   include: [{ model: app.model.Dept, as: 'children' }],
      //   // raw: true,
      // });
      // console.log(test.get({ plain: true }));
      // await app.model.Dept.destroy({ where: { level: 1 } });
    });
  }
};
