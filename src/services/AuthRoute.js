// 扩展路由，非授权跳转
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import React from 'react';

const AuthRoute = ({ component: Component, ...rest }) => {
  class A extends React.Component {
    render() {
      if (this.props.username) {
        // if(!this.props.username.active)  添加功能，区别对待正常用户 禁用用户和未激活用户
        // 重定向到用户资料设置页
        return <Route {...rest} render={props => <Component {...props} />} />;
      } else {
        const _to = {
          pathname: '/login',
          state: {
            from: this.props.location
          }
        };
        return <Redirect to={_to} />;
      }
    }
  }

  function mapStateToProps(state) {
    return { username: state.account.username };
  }

  const Auth = withRouter(connect(mapStateToProps)(A));
  return <Auth />;
};

export default AuthRoute;
