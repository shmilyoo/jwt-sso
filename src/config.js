import AccountBox from '@material-ui/icons/AccountBox';

const config = {};

export const pathTitle = {
  '/': '首页',
  '/brief/mine': '个人概况',
  '/brief/department': '部门概况',
  '/account/info': '资料',
  '/account/info/basic': '基本资料',
  '/account/info/edu': '教育经历',
  '/account/info/work': '工作经历',
  '/account/info/family': '家庭关系',
  '/account/changePasswd': '修改密码',
  '/account/changePasswd2': '修改密码2',
  '/account/changePasswd3': '修改密码3',
  '/auth/bind': '用户绑定',
  '/auth/sso': '统一登录',
  '/about': '关于',
  '/admin/organ/dept': '部门管理',
  '/admin/organ/person': '人员管理',
  '/admin/interface/api': '接口注册',
  '/admin/interface/sso': 'sso管理',
  '/admin/super/addAdmin': '添加管理',
  '/admin/super/admins': '管理列表',
  '/admin/about': '关于'
};

export const sysName = '统一认证系统';
export const server_base_url_product = '';
export const server_baseURL_dev = 'http://localhost:7001';
// 没有children就有path属性，反之则有state属性表明类别
export const leftMenu = [
  {
    title: '概况',
    state: 'brief', // 用于有子元素的菜单，在this.state中标记下拉是否展开
    icon: AccountBox,
    children: [
      { title: pathTitle['/brief/mine'], path: '/brief/mine' },
      { title: pathTitle['/brief/department'], path: '/brief/department' }
    ]
  },
  {
    title: '用户',
    state: 'account',
    icon: AccountBox,
    children: [
      { title: pathTitle['/account/info'], path: '/account/info/basic' },
      {
        title: pathTitle['/account/changePasswd'],
        path: '/account/changePasswd'
      },
      {
        title: pathTitle['/account/changePasswd2'],
        path: '/account/changePasswd2'
      },
      {
        title: pathTitle['/account/changePasswd3'],
        path: '/account/changePasswd3'
      }
    ]
  },
  {
    title: '授权',
    state: 'auth',
    icon: AccountBox,
    children: [
      // 我的授权（允许的第三方系统，用户绑定，申请），我的登录
      { title: pathTitle['/auth/bind'], path: '/auth/bind' },
      { title: pathTitle['/auth/sso'], path: '/auth/sso' }
    ]
  },
  { title: '关于', path: '/about', icon: AccountBox }
];

export const adminLeftMenu = [
  {
    title: '组织机构',
    state: 'organ',
    children: [
      { title: pathTitle['/admin/organ/dept'], path: '/admin/organ/dept' },
      { title: pathTitle['/admin/organ/person'], path: '/admin/organ/person' }
    ]
  },
  {
    title: '接口管理',
    state: 'interface',
    children: [
      {
        title: pathTitle['/admin/interface/api'],
        path: '/admin/interface/api'
      },
      { title: pathTitle['/admin/interface/sso'], path: '/admin/interface/sso' }
    ]
  },
  {
    title: '超级管理',
    state: 'super',
    children: [
      {
        title: pathTitle['/admin/super/addAdmin'],
        path: '/admin/super/addAdmin'
      },
      { title: pathTitle['/admin/super/admins'], path: '/admin/super/admins' }
    ]
  },
  { title: pathTitle['/admin/about'], state: 'about', path: '/admin/about' }
];

export default config;
