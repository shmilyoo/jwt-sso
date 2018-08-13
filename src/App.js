import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles, Typography } from '@material-ui/core';
import AuthRoute from './services/AuthRoute';
import Home from './containers/Home';
import Reg from './containers/Reg';
import Login from './containers/Login';
import withRoot from './services/withRoot';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
  }
});

class App extends React.Component {
  render() {
    let a = '1';
    const { classes } = this.props;
    return (
      <div>
        <div>aaaa</div>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/reg" component={Reg} />
          <AuthRoute path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(App));
