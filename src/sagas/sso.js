import {
  fork,
  take,
  put,
  call,
  takeLatest,
  takeLeading
} from 'redux-saga/effects';
import axios from 'axios';
import { md5Passwd } from '../services/utility';
import { stopSubmit } from 'redux-form';
import history from '../history';
import { types as ssoTypes } from '../reducers/sso';
import { types as accountTypes } from '../reducers/account';
import { actions as accountActions } from '../reducers/account';

function* authLogin() {
  while (true) {
    const { resolve, values, from, redirect, token, authOk } = yield take(
      ssoTypes.SAGA_AUTH_LOGIN_REQUEST
    );
    const username = values.username.toLowerCase();
    const password = md5Passwd(values.password);
    const remember = !!values.remember;
    const response = yield axios.post('/auth/login', {
      username,
      password,
      remember,
      from,
      redirect,
      token
    });
    if (response.success) {
      yield call(resolve);
      yield put(
        accountActions.loginSuccess(
          response.data.id,
          username,
          response.data.active
        )
      );
      const location = `${authOk}?token=${response.data.token}&redirect=${
        response.data.redirect
      }`;
      global.location = location;
    } else {
      yield put(stopSubmit('authLoginForm', { _error: response.error }));
    }
  }
}

function* getBindsFlow() {
  while (true) {
    yield take(accountTypes.SAGA_GET_BINDS_REQUEST);
    const res = yield axios.get('/auth/user/binds');
    if (res.success) {
      yield put(accountActions.setUserBinds(res.data));
    }
  }
}

function* toggleBindSaga(action) {
  const { id, agreed } = action;
  const res = yield axios.post('/auth/user/bind/toggle', { id, agreed });
  if (res.success) {
    yield put(accountActions.setUserBinds(res.data));
  }
}

function* toggleBindFlow() {
  // while (true) {
  yield takeLatest(accountTypes.SAGA_TOGGLE_BIND_REQUEST, toggleBindSaga);
  // }
}

export default [fork(authLogin), fork(getBindsFlow), fork(toggleBindFlow)];
