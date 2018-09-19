import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Link, withRouter, Redirect } from 'react-router-dom';
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
    const { classes, username } = this.props;
    const AdminLoginForm = reduxForm({
      form: 'adminLoginForm',
      initialValues: { username: 'aaa', remember: true }
    })(LoginForm);
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
              <AdminLoginForm admin onSubmit={this.handleSubmit} />
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
