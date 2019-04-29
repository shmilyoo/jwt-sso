'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const checkUser = app.middleware.checkUser(null, app);
  const checkAdmin = app.middleware.checkAdmin(null, app);
  const checkSso = app.middleware.checkSso(null, app);

  router.get('/', controller.home.index);
  router.get('/test', controller.home.test);
  router.get('/account/info', controller.home.index);
  router.get('/account/check/:username', controller.account.checkUser);
  router.get('/account/info/basic', checkUser, controller.account.basicInfo);
  router.post(
    '/account/info/basic',
    checkUser,
    controller.account.updateBasicInfo
  );
  router.get('/account/info/exp/:kind', checkUser, controller.account.getExp);
  router.post('/account/info/exp/:kind', checkUser, controller.account.setExp);
  router.post('/account/auth', checkUser, controller.account.auth);
  router.post('/account/login', controller.account.login);
  router.post('/account/logout', checkUser, controller.account.logout);
  router.post('/account/reg', controller.account.reg);
  router.get('/dept/all', controller.dept.getAll);
  router.post('/dept/add', checkAdmin, controller.dept.addDept);
  router.get('/dept/:id', controller.dept.getDept);
  router.get('/dept/check-symbol/:symbol', controller.dept.checkSymbol);
  router.post('/dept/update', checkAdmin, controller.dept.updateDept);
  router.post('/dept/delete', checkAdmin, controller.dept.deleteDept);
  router.post('/dept/move', checkAdmin, controller.dept.moveDept);
  router.get('/sso/all', checkAdmin, controller.sso.getAll);
  router.post('/sso/add', checkAdmin, controller.sso.addSso);
  router.post('/sso/update', checkAdmin, controller.sso.updateSso);
  router.post('/sso/delete', checkAdmin, controller.sso.deleteSso);
  router.post('/auth/login', controller.auth.login);
  router.post('/auth/check', checkSso, controller.auth.check);
  router.post('/auth/user/bind', checkSso, controller.auth.userBind);
  router.post('/auth/check/bind', checkSso, controller.auth.checkBind);
  router.get('/auth/user/binds', checkUser, controller.auth.userBinds); // 本地获取用户绑定列表
  router.post(
    '/auth/user/bind/toggle',
    checkUser,
    controller.auth.toggleUserBind
  ); // 本地用户变更绑定，允许或拒绝
  // '/sso-api/depts?time=unix时间戳',若time和system表中deptUpdateTime一致，
  // 则返回data为{hasChanged:false},其他则返回{hasChanged:true,deptArray,time}
  router.get('/sso-api/depts', checkSso, controller.api.deptArray);
};
