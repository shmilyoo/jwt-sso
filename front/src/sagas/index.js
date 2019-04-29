import { all } from 'redux-saga/effects';
import accountSaga from './account';
import ssoSaga from './sso';
// import routeSaga from "./route";

export default function* rootSaga() {
  yield all([...accountSaga, ...ssoSaga]);
}
