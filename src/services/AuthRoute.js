// @flow
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import React from 'react';
import type { ComponentType, Node } from 'react';

type Props = {
  user?: string,
  location: any
};

type DestructArgs = {
  component: ComponentType<any>,
  rest?: Array<mixed>
};

const AuthRoute = ({ component: Component, ...rest }: DestructArgs) => {
  class A extends React.Component<Props> {
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
