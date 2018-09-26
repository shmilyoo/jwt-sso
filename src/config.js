import AccountBox from '@material-ui/icons/AccountBox';

const config = {};

const pathTitle = {
  '/brief/mine': '个人概况',
  '/brief/department': '部门概况',
  '/account/info': '资料',
  '/account/changePasswd': '修改密码',
  '/account/changePasswd2': '修改密码2',
  '/account/changePasswd3': '修改密码3',
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
    state: 'brief',
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
      { title: '资料', path: '/account/info' },
      { title: '修改密码', path: '/account/changePasswd' },
      { title: '修改密码2', path: '/account/changePasswd2' },
      { title: '修改密码3', path: '/account/changePasswd3' }
    ]
  },
  { title: '关于', path: '/about', icon: AccountBox }
];

export const adminLeftMenu = [
  {
    title: '组织机构',
    state: 'organ',
    children: [
      { title: '部门管理', path: '/admin/organ/dept' },
      { title: '人员管理', path: '/admin/organ/person' }
    ]
  },
  {
    title: '接口管理',
    state: 'interface',
    children: [
      { title: '接口注册', path: '/admin/interface/api' },
      { title: 'sso管理', path: '/admin/interface/sso' }
    ]
  },
  {
    title: '超级管理',
    state: 'super',
    children: [
      { title: '添加管理', path: '/admin/super/addAdmin' },
      { title: '管理列表', path: '/admin/super/admins' }
    ]
  },
  { title: '关于', state: 'about', path: '/admin/about' }
];

export default config;
