import { fork, take, put, call } from 'redux-saga/effects';
import { SubmissionError, stopSubmit, stopAsyncValidation } from 'redux-form';
import { sleep } from '../services/utility';

function* check_reg() {
  while (true) {
    const { resolve, data } = yield take('saga-submit');
    yield sleep(1000);
    yield put(stopSubmit('regForm', { username: 'saga stop name' }));
    // yield call(resolve);
  }
}

function* check_username() {
  while (true) {
    const { values, resolve, reject } = yield take('saga-checkUsername');
    console.log('start check username saga');
    yield sleep(1000);
    if (['aaaa', 'bbbb', 'bbbb'].includes(values.username)) {
      // yield put(
      //   stopAsyncValidation("regForm", {
      //     username: `用户名${values.username}已存在`
      //   })
      // );
      yield call(reject, { username: `用户名${values.username}已存在` });
    } else {
      yield call(resolve);
    }
  }
}

export default [fork(check_username), fork(check_reg)];
