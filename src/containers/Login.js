import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import { Card, CardContent, Typography, withStyles } from '@material-ui/core';
import compose from 'recompose/compose';
import { types as accountTypes } from '../reducers/account';

const styles = theme => ({
  card: {
    width: '30rem'
  },
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: theme.typography.title3
});

class Login extends React.Component {
  handleSubmit = values => {
    const state = this.props.location.state;
    return new Promise(resolve => {
      this.props.dispatch({
        type: accountTypes.SAGA_LOGIN_REQUEST,
        resolve,
        values,
        from: state ? state.from : { pathname: '/' }
      });
    });
  };
  render() {
    const { classes, username } = this.props;
    return (
      <div className={classes.container}>
        {username ? (
          <Redirect to={{ pathname: '/' }} />
        ) : (
          <Card className={classes.card}>
            <CardContent>
              <Typography align="center" className={classes.title}>
                登录
              </Typography>
              <LoginForm onSubmit={this.handleSubmit} />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.account.username
  };
}
export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(Login);
