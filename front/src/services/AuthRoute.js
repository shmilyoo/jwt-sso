// 扩展路由，非授权跳转
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React from 'react';
import { actions as accountActions } from '../reducers/account';

function mapStateToProps(state) {
  return { username: state.account.username, active: state.account.active };
}

function mapDispatchToProps(dispatch) {
  return {
    clearAuth: () => {
      dispatch(accountActions.clearAuth());
    }
  };
}

const AuthRoute = props => {
  const {
    component: Component,
    username,
    active,
    location,
    clearAuth,
    ...rest
  } = props;
  if (username) {
    if (active === 1 && location.pathname !== '/account/info') {
      // 重定向到用户资料设置页;
      return <Redirect to="/account/info?type=basic" />;
    }
    if (active === 2) {
      clearAuth();
      alert('用户被禁用，请联系管理员');
      return <Redirect to="/login" />;
    }
    return <Route {...rest} render={props => <Component {...props} />} />;
  } else {
    const _to = {
      pathname: '/login',
      state: {
        from: location
      }
    };
    return <Redirect to={_to} />;
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthRoute);
