import { fork, take, put, call } from 'redux-saga/effects';
import { SubmissionError, stopSubmit, stopAsyncValidation } from 'redux-form';
import { sleep, md5Passwd } from '../services/utility';
import { types as accountType } from '../reducers/account';
import { types as commonType } from '../reducers/common';
import { actions as commonActions } from '../reducers/common';
import axios from 'axios';
import history from '../history';

/**
 * 处理用户注册页面的submit异步请求
 */
function* accountRegFlow() {
  while (true) {
    const { resolve, values } = yield take(accountType.SAGA_REG_REQUEST);
    yield put({ type: commonType.START_LOADING });
    let { username, password1: password } = values;
    password = md5Passwd(password);
    const response = yield axios.post('account/reg', { username, password });
    if (response.success) {
      yield call(resolve);
      yield call(history.push, '/login');
    } else {
      yield put(stopSubmit('regForm', { _error: response.error }));
      yield put(commonActions.showMessage(response.error));
    }
    yield put({ type: commonType.STOP_LOADING });
  }
}

function* accountLoginFlow() {
  while (true) {
    console.log('login saga');
    if (!localStorage.getItem('token')) {
      // 如果页面是未登录状态
      let { resolve, values, from } = yield take(
        accountType.SAGA_LOGIN_REQUEST
      );
      const username = values.username.toLowerCase();
      const password = md5Passwd(values.password);
      const response = yield axios.post('account/login', {
        username,
        password
      });
      if (response.success) {
        yield call(resolve);
        localStorage.setItem('token', response.data.token);
        yield put({
          type: accountType.LOGIN_SUCCESS,
          username,
          active: response.data.active
        });
        yield call(history.push, from.pathname); // 根据url的redirect进行跳转
      } else {
        yield put(stopSubmit('loginForm', { _error: response.error }));
        yield put(commonActions.showMessage(response.error, 'error'));
      }
    }
    yield take(accountType.SAGA_LOGOUT);
  }
}

/**
 * 处理用户注册页面username焦点消失时的唯一性验证
 */
function* checkUsernameFlow() {
  while (true) {
    const { values, resolve, reject } = yield take(
      accountType.SAGA_CHECK_USERNAME
    );
    const response = yield axios.get(`account/check/${values.username}`);
    if (response.success) {
      if (response.data.isNameExist) {
        yield call(reject, { username: `用户名${values.username}已存在` });
      } else {
        yield call(resolve);
      }
    } else {
      console.log('fsfsdfsdfd1221');
      yield call(reject, { username: ' ' });
      yield put(commonActions.showMessage(response.error, 'error'));
    }
  }
}

/**
 * 在初始打开网页的时候到服务器获取用户认证相关信息
 */
function* getUserInfoFlow() {
  while (true) {
    const { username } = yield take(accountType.SAGA_GET_USER_INFO);
    // url中有username，header中有auth token，服务端综合判定
    const response = yield axios.get(`account/info/${username}`);
  }
}

export default [
  fork(checkUsernameFlow),
  fork(accountRegFlow),
  fork(getUserInfoFlow),
  fork(accountLoginFlow)
];
