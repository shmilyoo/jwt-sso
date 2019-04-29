import { fork, take, put, call } from 'redux-saga/effects';
import { stopSubmit } from 'redux-form';
import { md5Passwd } from '../services/utility';
import { types as accountTypes } from '../reducers/account';
import { actions as accountActions } from '../reducers/account';
import { types as commonTypes } from '../reducers/common';
import axios from 'axios';
import Cookies from 'js-cookie';
import history from '../history';

/**
 * 处理用户注册页面的submit异步请求
 */
function* regFlow() {
  while (true) {
    const { resolve, values } = yield take(accountTypes.SAGA_REG_REQUEST);
    let { username, password1: password } = values;
    password = md5Passwd(password);
    const response = yield axios.post('account/reg', { username, password });
    if (response.success) {
      yield call(resolve);
      yield call(history.push, '/login');
    } else {
      yield put(stopSubmit('regForm', { _error: response.error }));
    }
  }
}

function* loginFlow() {
  while (true) {
    let { resolve, values, from } = yield take(accountTypes.SAGA_LOGIN_REQUEST);
    const username = values.username.toLowerCase();
    const password = md5Passwd(values.password);
    const remember = !!values.remember;
    const response = yield axios.post('account/login', {
      username,
      password,
      remember
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
      yield call(history.push, from.pathname); // 根据url的redirect进行跳转
    } else {
      yield put(stopSubmit('loginForm', { _error: response.error }));
    }
  }
}

function* logoutFlow() {
  while (true) {
    const { type } = yield take([
      accountTypes.SAGA_LOGOUT_REQUEST,
      accountTypes.SAGA_FORCE_LOGOUT
    ]);
    if (type === accountTypes.SAGA_LOGOUT_REQUEST) {
      yield axios.post('/account/logout');
    }
    yield put(accountActions.clearAuth());
  }
}

/**
 * 处理用户注册页面username焦点消失时的唯一性验证
 */
function* checkUsernameFlow() {
  while (true) {
    const { values, resolve, reject } = yield take(
      accountTypes.SAGA_CHECK_USERNAME
    );
    const response = yield axios.get(`account/check/${values.username}`);
    if (response.success) {
      if (response.data.isNameExist) {
        yield call(reject, { username: `用户名${values.username}已存在` });
      } else {
        yield call(resolve);
      }
    } else {
      yield call(reject, { username: ' ' }); // 空格用于保持textField的error提示行高度
    }
  }
}

/**
 * 在初始打开网页的时候到服务器获取用户认证相关信息
 * cookie中本地无法获取id，在此获取用户的id
 */
function* checkUserAuthFlow() {
  // while (true) {
  yield take(accountTypes.SAGA_CHECK_USER_AUTH);
  const res = yield axios.post('/account/auth');
  if (res.success) {
    const { id, username, active } = res.data;
    yield put(accountActions.loginSuccess(id, username, active));
  }
  // }
}

function* getBasicInfoFlow() {
  while (true) {
    yield take(accountTypes.SAGA_GET_USER_BASIC_INFO);
    const response = yield axios.get('/account/info/basic');
    if (response.success) {
      yield put(accountActions.setBasicInfo(response.data));
    }
  }
}

function* setBasicInfoFlow() {
  while (true) {
    const { resolve, values } = yield take(
      accountTypes.SAGA_SET_USER_BASIC_INFO
    );
    const response = yield axios.post('/account/info/basic', values);
    if (response.success) {
      yield put(accountActions.setBasicInfo(values));
      yield call(resolve);
    } else {
      yield put(stopSubmit('basicInfoForm', { _error: response.error }));
    }
  }
}

function* getExpInfoFlow() {
  while (true) {
    const { kind } = yield take(accountTypes.SAGA_GET_USER_EXP_INFO);
    const response = yield axios.get(`/account/info/exp/${kind}`);
    if (response.success) {
      yield put(accountActions.setExpInfo(kind, response.data));
    }
  }
}
// SAGA_SET_USER_EXP_INFO

function* setExpInfoFlow() {
  while (true) {
    const { resolve, kind: type, values } = yield take(
      accountTypes.SAGA_SET_USER_EXP_INFO
    );
    console.log(JSON.stringify(values));
    const response = yield axios.post(`/account/info/exp/${type}`, values);
    if (response.success) {
      yield put(accountActions.setExpInfo(type, response.data));
      yield call(resolve);
    } else {
      yield put(stopSubmit('basicInfoForm', { _error: response.error }));
    }
  }
}

export default [
  fork(checkUsernameFlow),
  fork(regFlow),
  fork(checkUserAuthFlow),
  fork(loginFlow),
  fork(logoutFlow),
  fork(getBasicInfoFlow),
  fork(setBasicInfoFlow),
  fork(getExpInfoFlow),
  fork(setExpInfoFlow)
];
