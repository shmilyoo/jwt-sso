const config = {};

export const server_base_url_product = '';
export const server_baseURL_dev = 'http://localhost:7001';
export const leftMenu = [
  { title: '概况', path: '/brief' },
  {
    title: '用户',
    state: 'account',
    children: [
      { title: '资料', path: '/account/info' },
      { title: '修改密码', path: '/account/changePasswd' },
      { title: '修改密码2', path: '/account/changePasswd' },
      { title: '修改密码3', path: '/account/changePasswd' }
    ]
  },
  { title: '关于', path: 'about' }
];

export default config;
