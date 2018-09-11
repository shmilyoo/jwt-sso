import AccountBox from '@material-ui/icons/AccountBox';

const config = {};

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
      { title: '个人概况', path: '/brief/mine' },
      { title: '部门概况', path: '/brief/department' }
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

export default config;
