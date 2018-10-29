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
    yield put({ type: commonTypes.START_LOADING });
    let { username, password1: password } = values;
    password = md5Passwd(password);
    const response = yield axios.post('account/reg', { username, password });
    if (response.success) {
      yield call(resolve);
      yield call(history.push, '/login');
    } else {
      yield put(stopSubmit('regForm', { _error: response.error }));
    }
    yield put({ type: commonTypes.STOP_LOADING });
  }
}

function* loginFlow() {
  let isLogin = !!Cookies.get('username');
  while (true) {
    console.log('login flow start');
    if (!isLogin) {
      // 如果页面是未登录状态
      console.log('wait for login request');
      let { resolve, values, from } = yield take(
        accountTypes.SAGA_LOGIN_REQUEST
      );
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
        isLogin = true;
        yield call(history.push, from.pathname); // 根据url的redirect进行跳转
      } else {
        isLogin = false;
        yield put(stopSubmit('loginForm', { _error: response.error }));
      }
      console.log(`log in end, islogin is ${isLogin}`);
    }
    if (isLogin) {
      console.log('等待logout请求');
      const { type } = yield take([
        accountTypes.SAGA_LOGOUT_REQUEST,
        accountTypes.SAGA_FORCE_LOGOUT
      ]);
      if (type === accountTypes.SAGA_LOGOUT_REQUEST) {
        const response = yield axios.post('/account/logout');
        if (response.success) {
          yield put(accountActions.logoutSuccess());
        } else {
          yield put(accountActions.clearAuth());
        }
      }
      isLogin = false;
    }
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
 */
function* getUserInfoFlow() {
  while (true) {
    yield take(accountTypes.SAGA_GET_USER_AUTH_INFO);
    // url中有username，header中有auth token，服务端综合判定
    try {
      yield axios.get('/account/auth');
    } catch (e) {}

    // yield put({ type: accountTypes.SAGA_FORCE_LOGOUT });
    // yield put(commonActions.showMessage('远程验证出错，强制退出', 'warn'));
  }
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
    const { kind: type } = yield take(accountTypes.SAGA_GET_USER_EXP_INFO);
    const response = yield axios.get(`/account/info/exp/${type}`);
    if (response.success) {
      yield put(accountActions.setExpInfo(type, response.data));
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
  fork(getUserInfoFlow),
  fork(loginFlow),
  fork(getBasicInfoFlow),
  fork(setBasicInfoFlow),
  fork(getExpInfoFlow),
  fork(setExpInfoFlow)
];
