import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
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
class AdminLogin extends React.PureComponent {
  handleSubmit = values => {
    return new Promise(resolve => {
      this.props.dispatch(accountActions.adminLogin(resolve, values));
    });
  };
  render() {
    console.log('admin login render');
    const { classes, username } = this.props;
    return (
      <div className={classes.container}>
        {username ? (
          <Redirect to={{ pathname: '/' }} />
        ) : (
          <Card className={classes.card}>
            <CardContent>
              <Typography align="center" className={classes.title}>
                管理员登录
              </Typography>
              <LoginForm
                form="adminLoginForm"
                initialValues={{ username: 'aaa', remember: true }}
                onSubmit={this.handleSubmit}
              />
              <Typography align="right" className={classes.buttomText}>
                没有账户,
                <Link to="/admin/reg">申请管理员</Link>
              </Typography>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    adminName: state.account.adminName
  };
}
export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(AdminLogin);
