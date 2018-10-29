import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import qs from 'qs';
import LoginForm from '../../forms/account/LoginForm';
import {
  Card,
  CardContent,
  Typography,
  withStyles,
  Grid
} from '@material-ui/core';
import compose from 'recompose/compose';
import { actions as ssoActions } from '../../reducers/sso';
import history from '../../history';

const style = theme => ({
  card: {
    width: '30rem'
  },
  root: {
    height: '80%'
  },
  title: {
    margin: '2rem 0'
  }
});

class AuthLogin extends PureComponent {
  constructor(props) {
    super(props);
    const { from, token, redirect, authOk } = qs.parse(
      this.props.location.search,
      {
        ignoreQueryPrefix: true
      }
    );
    if (!(from && token && redirect && authOk)) {
      history.push(
        `/redirect?content=${encodeURIComponent(
          '授权认证信息不全'
        )}&redirect=${redirect}`
      );
    }
    this.state = {
      subTitle: `--针对${from}进行授权`,
      token,
      redirect,
      from,
      authOk
    };
  }

  handleSubmit = values => {
    const { from, token, redirect, authOk } = this.state;
    return new Promise(resolve => {
      this.props.dispatch(
        ssoActions.saga_auth_login_request(
          resolve,
          values,
          from,
          redirect,
          token,
          authOk
        )
      );
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <Grid
        className={classes.root}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <Card className={classes.card}>
            <CardContent>
              <div className={classes.title}>
                <Typography align="center" variant="h4">
                  授权登录
                </Typography>
                <Typography align="right" color="textSecondary">
                  {this.state.subTitle}
                </Typography>
              </div>
              <LoginForm
                form="authLoginForm"
                initialValues={{ username: 'dddd', remember: true }}
                onSubmit={this.handleSubmit}
              />
              <Typography align="right" className={classes.buttomText}>
                没有账户,
                <Link to="/reg">注册</Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    // username: state.account.username
  };
}
export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(AuthLogin);
