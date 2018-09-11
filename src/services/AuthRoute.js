// 扩展路由，非授权跳转
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import React from 'react';

function mapStateToProps(state) {
  return { username: state.account.username };
}

const AuthRoute = props => {
  const { component: Component, username, location, ...rest } = props;
  if (username) {
    // if(!this.props.username.active)  添加功能，区别对待正常用户 禁用用户和未激活用户
    // 重定向到用户资料设置页
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
