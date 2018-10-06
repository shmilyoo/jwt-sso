import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import LoginForm from '../../forms/account/LoginForm';
import { Card, CardContent, Typography, withStyles } from '@material-ui/core';
import compose from 'recompose/compose';
import { actions as accountActions } from '../../reducers/account';

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
    const from = state ? state.from : this.props.location;
    return new Promise(resolve => {
      // 如果是从未授权初始页面跳转到login页面，则成功后跳转回去。
      // 如果是以dialog方式跳出的login组件，则返回当前页面
      this.props.dispatch(accountActions.userLogin(resolve, values, from));
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
              <LoginForm
                form="loginForm"
                initialValues={{ username: 'dddd', remember: true }}
                onSubmit={this.handleSubmit}
              />
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
