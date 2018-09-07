export const types = {
  LOGIN_SUCCESS: 'ACCOUNT/LOGIN_SUCCESS',
  LOGOUT_SUCCESS: 'ACCOUNT/LOGOUT_SUCCESS',
  AUTH_INFO: 'ACCOUNT/AUTH_INFO',
  SAGA_GET_USER_INFO: 'ACCOUNT/SAGA_GET_USER_INFO',
  SAGA_REG_REQUEST: 'ACCOUNT/SAGA_REG_REQUEST',
  SAGA_LOGIN_REQUEST: 'ACCOUNT/SAGA_LOGIN_REQUEST',
  SAGA_LOGOUT_REQUEST: 'ACCOUNT/SAGA_LOGOUT_REQUEST',
  SAGA_FORCE_LOGOUT: 'ACCOUNT/SAGA_FORCE_LOGOUT',
  SAGA_CHECK_USERNAME: 'ACCOUNT/SAGA_CHECK_USERNAME'
};

export const actions = {};

const initState = {
  username: '',
  active: 2,
  isLoading: false // being logining or reging
};

export default function accountReducer(state = initState, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        username: action.username,
        active: action.active
      };
    case types.AUTH_INFO:
      return {
        ...state,
        username: action.username,
        active: action.active
      };
    case types.LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        username: '',
        active: 2
      };
    default:
      return state;
  }
}
