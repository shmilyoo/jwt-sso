import { fork, take, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { md5Passwd } from '../services/utility';
import { stopSubmit } from 'redux-form';
import history from '../history';
import { types as ssoTypes } from '../reducers/sso';

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
      const location = `${authOk}?token=${response.data.token}&redirect=${
        response.data.redirect
      }`;
      global.location = location;
    } else {
      yield put(stopSubmit('authLoginForm', { _error: response.error }));
    }
  }
}

export default [fork(authLogin)];
