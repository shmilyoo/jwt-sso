import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Message from './containers/Message';
import AuthRoute from './services/AuthRoute';
import Home from './containers/Home';
import Reg from './containers/account/Reg';
import Login from './containers/account/Login';
import themeProvider from './services/themeProvider';
import compose from 'recompose/compose';
import AdminRoot from './containers/admin/AdminRoot';
import AdminLogin from './containers/admin/Login';

class App extends React.Component {
  componentDidUpdate() {
    console.log('App did update');
  }
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/reg" component={Reg} />} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminRoot} />
          <AuthRoute path="/" component={Home} />
        </Switch>
        <Message />
      </React.Fragment>
    );
  }
}

export default compose(
  withRouter,
  themeProvider
)(App);

// export default withRouter(connect(mapStateToProps)(App));
