import accountReducer from './account';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  account: accountReducer,
  form: formReducer
});

export default rootReducer;
