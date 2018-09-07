import accountReducer from './account';
import commonReducer from './common';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  account: accountReducer,
  common: commonReducer,
  form: formReducer
});

export default rootReducer;
