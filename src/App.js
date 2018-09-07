import React from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  withStyles,
  Typography,
  Snackbar,
  SnackbarContent,
  Button,
  IconButton
} from '@material-ui/core';
import AuthRoute from './services/AuthRoute';
import Home from './containers/Home';
import Reg from './containers/Reg';
import Login from './containers/Login';
import withRoot from './services/withRoot';
import { actions as commonAction } from './reducers/common';
import compose from 'recompose/compose';

const styles = theme => ({
  info: {
    backgroundColor: theme.palette.info.main
  },
  warn: {
    backgroundColor: theme.palette.warn.main
  },
  error: {
    backgroundColor: theme.palette.error.main
  }
});

class App extends React.Component {
  closeMessage = () => {
    this.props.dispatch(commonAction.closeMessage());
  };
  render() {
    const { classes, message, messageType, showMessage } = this.props;
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/reg" component={Reg} />} />
          <AuthRoute path="/" component={Home} />
        </Switch>
        <Snackbar
          open={showMessage}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          autoHideDuration={3000}
          onClose={this.closeMessage}
        >
          <SnackbarContent
            className={classes[messageType]}
            message={<strong>{message}</strong>}
          />
        </Snackbar>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    showMessage: state.common.showMessage,
    message: state.common.message,
    messageType: state.common.messageType
  };
}

export default compose(
  withRouter,
  withRoot,
  withStyles(styles),
  connect(mapStateToProps)
)(App);

// export default withRouter(connect(mapStateToProps)(App));
