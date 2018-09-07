import {
  call,
  put,
  takeEvery,
  takeLatest,
  take,
  reject,
  push,
  fork,
  all
} from 'redux-saga/effects';
import accountSaga from './account';
// import routeSaga from "./route";

export default function* rootSaga() {
  yield all([...accountSaga]);
}
