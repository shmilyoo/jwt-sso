import Cookies from 'js-cookie';

export const types = {
  LOGIN_SUCCESS: 'ACCOUNT/LOGIN_SUCCESS',
  LOGOUT_SUCCESS: 'ACCOUNT/LOGOUT_SUCCESS',
  ADMIN_LOGIN_SUCCESS: 'ACCOUNT/ADMIN_LOGIN_SUCCESS',
  ADMIN_LOGOUT_SUCCESS: 'ACCOUNT/ADMIN_LOGOUT_SUCCESS',
  AUTH_INFO: 'ACCOUNT/AUTH_INFO',
  CLEAR_AUTH: 'ACCOUNT/CLEAR_AUTH',
  SET_USER_BASIC_INFO: 'ACCOUNT/SET_USER_BASIC_INFO',
  SET_USER_EXP_INFO: 'ACCOUNT/SET_USER_EXP_INFO',
  SET_USER_BINDS: 'ACCOUNT/SET_USER_BINDS',
  UPDATE_USER_BASIC_INFO: 'ACCOUNT/UPDATE_USER_BASIC_INFO',
  SAGA_CHECK_USER_AUTH: 'ACCOUNT/SAGA_CHECK_USER_AUTH',
  SAGA_GET_USER_BASIC_INFO: 'ACCOUNT/SAGA_GET_USER_BASIC_INFO',
  SAGA_GET_USER_EXP_INFO: 'ACCOUNT/SAGA_GET_USER_EXP_INFO',
  SAGA_SET_USER_EXP_INFO: 'ACCOUNT/SAGA_SET_USER_EXP_INFO',
  SAGA_SET_USER_BASIC_INFO: 'ACCOUNT/SAGA_SET_USER_BASIC_INFO', //basicinfo 页面submit
  SAGA_GET_BINDS_REQUEST: 'ACCOUNT/SAGA_GET_BINDS_REQUEST',
  SAGA_TOGGLE_BIND_REQUEST: 'ACCOUNT/SAGA_TOGGLE_BIND_REQUEST',
  SAGA_REG_REQUEST: 'ACCOUNT/SAGA_REG_REQUEST',
  SAGA_LOGIN_REQUEST: 'ACCOUNT/SAGA_LOGIN_REQUEST',
  SAGA_LOGOUT_REQUEST: 'ACCOUNT/SAGA_LOGOUT_REQUEST',
  SAGA_FORCE_LOGOUT: 'ACCOUNT/SAGA_FORCE_LOGOUT',
  SAGA_CHECK_USERNAME: 'ACCOUNT/SAGA_CHECK_USERNAME',
  SAGA_ADMIN_LOGIN_REQUEST: 'ADMIN/SAGA_ADMIN_LOGIN_REQUEST',
  SAGA_ADMIN_LOGOUT_REQUEST: 'ADMIN/SAGA_ADMIN_LOGOUT_REQUEST'
};

export const actions = {
  adminLogin: (resolve, values) => ({
    type: types.SAGA_ADMIN_LOGIN_REQUEST,
    resolve,
    values
  }),
  adminLoginSuccess: (adminName, isSuperAdmin) => ({
    type: types.ADMIN_LOGIN_SUCCESS,
    adminName,
    isSuperAdmin
  }),
  userAuth: (username, active, id = '') => ({
    type: types.AUTH_INFO,
    id,
    username,
    active
  }),
  clearAuth: () => ({
    type: types.CLEAR_AUTH
  }),
  sagaForceLogout: () => ({ type: types.SAGA_FORCE_LOGOUT }),
  userLogin: (resolve, values, from) => ({
    type: types.SAGA_LOGIN_REQUEST,
    resolve,
    values,
    from
  }),
  loginSuccess: (id, username, active) =>
    actions.userAuth(username, active, id),
  logoutSuccess: () => ({ type: types.LOGOUT_SUCCESS }),
  getBasicInfo: () => ({ type: types.SAGA_GET_USER_BASIC_INFO }),
  setBasicInfo: data => ({ type: types.SET_USER_BASIC_INFO, data }),
  setBasicInfoRequest: (resolve, values) => ({
    type: types.SAGA_SET_USER_BASIC_INFO,
    resolve,
    values
  }),
  /**
   * 在用户刷新网页，第一次加载时，如果本地cookie有用户信息，则增加一次远程验证
   */
  checkUserAuth: () => ({ type: types.SAGA_CHECK_USER_AUTH }),
  /**
   * @param {'work'|'education'} kind 经历类型
   */
  getExpInfo: kind => ({
    type: types.SAGA_GET_USER_EXP_INFO,
    kind
  }),
  setExpInfoRequest: (resolve, kind, values) => ({
    type: types.SAGA_SET_USER_EXP_INFO,
    resolve,
    kind,
    values
  }),
  setExpInfo: (kind, values) => ({
    type: types.SET_USER_EXP_INFO,
    kind,
    values
  }),
  setUserBinds: binds => ({
    type: types.SET_USER_BINDS,
    binds
  })
};

const initState = {
  id: '',
  username: '',
  active: 2, // 账户状态: 0正常，1未激活,2禁用
  adminName: '',
  isSuperAdmin: false,
  info: {}, // {basic:{},work:[],education,[]}
  binds: null
};

export default function accountReducer(state = initState, action) {
  switch (action.type) {
    case types.AUTH_INFO:
      return {
        ...state,
        id: action.id,
        username: action.username,
        active: action.active
      };
    case types.CLEAR_AUTH:
      Cookies.remove('username');
      Cookies.remove('active');
      return {
        ...state,
        ...initState
      };
    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        ...initState
      };
    case types.ADMIN_LOGIN_SUCCESS:
      return {
        ...state,
        adminName: action.adminName,
        isSuperAdmin: action.isSuperAdmin
      };
    case types.ADMIN_LOGOUT_SUCCESS:
      // clear cookie
      return {
        ...state,
        adminName: '',
        isSuperAdmin: false
      };
    case types.SET_USER_BASIC_INFO:
      return {
        ...state,
        info: {
          ...state.info,
          basic: action.data
        }
      };
    case types.UPDATE_USER_BASIC_INFO:
      return {
        ...state,
        info: {
          ...state.info,
          basic: action.data
        }
      };
    case types.SET_USER_EXP_INFO:
      return {
        ...state,
        info: {
          ...state.info,
          [action.kind]: action.values
        }
      };
    case types.SET_USER_BINDS:
      return {
        ...state,
        binds: action.binds
      };
    default:
      return state;
  }
}
