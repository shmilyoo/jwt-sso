export const types = {
  LOGIN_SUCCESS: 'ACCOUNT/LOGIN_SUCCESS',
  LOGOUT_SUCCESS: 'ACCOUNT/LOGOUT_SUCCESS',
  ADMIN_LOGIN_SUCCESS: 'ACCOUNT/ADMIN_LOGIN_SUCCESS',
  ADMIN_LOGOUT_SUCCESS: 'ACCOUNT/ADMIN_LOGOUT_SUCCESS',
  AUTH_INFO: 'ACCOUNT/AUTH_INFO',
  SAGA_GET_USER_INFO: 'ACCOUNT/SAGA_GET_USER_INFO',
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
  userLogin: (resolve, values, from) => ({
    type: types.SAGA_LOGIN_REQUEST,
    resolve,
    values,
    from
  }),
  loginSuccess: (username, active) => ({
    type: types.LOGIN_SUCCESS,
    username,
    active
  }),
  logoutSuccess: () => {
    // remove cookie
    return { type: types.LOGOUT_SUCCESS };
  }
};

const initState = {
  username: '',
  active: 2,
  adminName: '',
  isSuperAdmin: false
};

export default function accountReducer(state = initState, action) {
  switch (action.type) {
    case types.AUTH_INFO:
      return {
        ...state,
        username: action.username,
        active: action.active
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        username: action.username,
        active: action.active
      };
    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        username: '',
        active: 2
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
    default:
      return state;
  }
}
