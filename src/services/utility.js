// 一些辅助函数
import { types as accountType } from '../reducers/account';
import jwtDecode from 'jwt-decode';
import md5 from 'md5';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * client端启动前加载本地用户token信息，设置相关state
 */
export const initAuthInfoAtStart = dispatch => {
  console.log('init start');
  // 修改为cookie 存储
  const token = localStorage.getItem('token');
  // decode token， state中dispatch设置username active 等信息，判断过期时间等
  if (token) {
    const decoded = jwtDecode(token);
    if (decoded && decoded.username) {
      dispatch({
        type: accountType.AUTH_INFO,
        username: decoded.username,
        active: decoded.active || 1
      });
      // 改为cookie session方案，不再做检查了
      // 如果本地保存有用户信息，则从服务器获取用户实时相关信息，避免本地信息过期或被篡改
      // dispatch({
      //   type: accountType.SAGA_GET_USER_INFO,
      //   username: decoded.username
      // });
    }
  }
};

/**
 * 重构每个表单的submit函数，避免重复代码
 */
export const formSubmit = (action, dispatch) => values =>
  new Promise(resolve => {
    dispatch({ type: action, resolve, values });
  });

/**
 *
 * @param {string} password 用户原始密码
 * @return 密码的md5值，32位
 */
export const md5Passwd = password => md5(password);
