// 扩展路由，非授权跳转
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React from 'react';

function mapStateToProps(state) {
  return { username: state.account.username, active: state.account.active };
}

const AuthRoute = props => {
  const { component: Component, username, active, location, ...rest } = props;
  if (username) {
    // if (active === 1 && location.pathname !== '/account/info') {
    //   // 重定向到用户资料设置页;
    //   return <Redirect to="/account/info?type=basic" />;
    // }
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

// const Auth = withRouter(connect(mapStateToProps)(A));
// const Auth = withRouter(connect(mapStateToProps)(A));
// return <Auth />;

export default connect(mapStateToProps)(AuthRoute);
