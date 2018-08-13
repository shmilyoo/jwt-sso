import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import React from 'react';

const AuthRoute = ({ component: Component, ...rest }) => {
  class A extends React.Component {
    render() {
      if (this.props.user) {
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
    return { user: state.account.user };
  }

  const Auth = withRouter(connect(mapStateToProps)(A));
  return <Auth />;
};

export default AuthRoute;
