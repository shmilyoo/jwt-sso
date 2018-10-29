import Cookies from 'js-cookie';

export const types = {
  SAGA_AUTH_LOGIN_REQUEST: 'SSO/SAGA_AUTH_LOGIN_REQUEST'
};

export const actions = {
  saga_auth_login_request: (
    resolve,
    values,
    from,
    redirect,
    token,
    authOk
  ) => ({
    type: types.SAGA_AUTH_LOGIN_REQUEST,
    resolve,
    values,
    from,
    redirect,
    token,
    authOk
  })
};

const initState = {};

export default function accountReducer(state = initState, action) {
  switch (action.type) {
    case types.AUTH_INFO:
      return {
        ...state,
        id: action.id,
        username: action.username,
        active: action.active
      };
    default:
      return state;
  }
}
