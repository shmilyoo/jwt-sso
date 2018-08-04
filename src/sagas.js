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
import { SubmissionError, stopSubmit, stopAsyncValidation } from 'redux-form';
import { sleep } from './services/utility';
import history from './history';

function* check_reg() {
  while (true) {
    const action = yield take('saga-submit');
    console.log('saga-' + JSON.stringify(action));
    yield sleep(1000);
    yield put(stopSubmit('regForm', { username: 'saga stop name' }));
  }
}

function* check_username(action) {
  while (true) {
    console.log('init check username saga');
    const action = yield take('saga-checkUsername');
    console.log('start check username saga');
    yield sleep(1000);
    if (['aaaa', 'bbbb', 'bbbb'].includes(action.values.username)) {
      yield put(
        stopAsyncValidation('regForm', {
          username: `用户名${action.values.username}已存在`
        })
      );
    }
  }
}

export default function* rootSaga() {
  yield all([fork(check_username), fork(check_reg)]);
}

// export const playerSagas = [
//   fork(watchAudioEnded),
//   fork(watchAudioVolumeChanged),
//   fork(watchInitApp),
//   fork(watchPlaySelectedTrack)
// ];
