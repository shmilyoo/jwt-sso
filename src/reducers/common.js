import { sysName } from '../config';

export const types = {
  START_LOADING: 'COMMON/START_LOADING',
  STOP_LOADING: 'COMMON/STOP_LOADING',
  TOGGLE_LOADING: 'COMMON/TOGGLE_LOADING',
  SHOW_MESSAGE: 'COMMON/SHOW_MESSAGE',
  CLOSE_MESSAGE: 'COMMON/CLOSE_MESSAGE',
  CHANGE_TITLE: 'COMMON/CHANGE_TITLE'
};

export const actions = {
  showMessage: (message, messageType) => {
    messageType =
      ['info', 'warn', 'error'].indexOf(messageType) >= 0
        ? messageType
        : 'info';
    return {
      type: types.SHOW_MESSAGE,
      message,
      messageType
    };
  },
  closeMessage: () => ({
    type: types.CLOSE_MESSAGE
  })
};

const initState = {
  isLoading: false,
  showMessage: false,
  message: '',
  messageColor: 'info'
};

export default (state = initState, action) => {
  switch (action.type) {
    case types.START_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case types.STOP_LOADING:
      return {
        ...state,
        isLoading: false
      };
    case types.TOGGLE_LOADING:
      return {
        ...state,
        isLoading: !action.isLoading
      };
    case types.SHOW_MESSAGE:
      return {
        ...state,
        showMessage: true,
        message: action.message,
        messageType: action.messageType
      };
    case types.CLOSE_MESSAGE:
      return {
        ...state,
        showMessage: false,
        message: ''
      };
    case types.CHANGE_TITLE:
      document.title = `${action.title} - ${sysName}`;
      return {
        ...state,
        title: action.title
      };
    default:
      return state;
  }
};
