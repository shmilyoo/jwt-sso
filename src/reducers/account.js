export const type = {
  LOGIN_REQUEST: 'ACCOUNT/LOGIN_REQUEST',
  LOGIN_SUCCESS: 'ACCOUNT/LOGIN_SUCCESS',
  LOGOUT_REQUEST: 'ACCOUNT/LOGOUT_REQUEST',
  LOGOUT_SUCCESS: 'ACCOUNT/LOGOUT_SUCCESS'
};

const initState = {
  user: '',
  isLoading: false // being logining or reging
};

export default function accountReducer(state = initState, action) {
  switch (action.type) {
    case type.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case type.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user,
        isLoading: false
      };
    case 'submit':
      console.log('reducer submit');
      return {
        ...state
      };
    default:
      return state;
  }
}
