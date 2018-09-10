import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import blue from '@material-ui/core/colors/blue';
import { required } from '../../services/validate';
import { trim } from '../../services/normalize';
import { Button, Typography } from '@material-ui/core';
import { RenderTextField, renderSwitch } from './renderFields';
import grey from '@material-ui/core/colors/grey';
import { actions as accountActions } from '../../reducers/account';
import { types as accountTypes } from '../../reducers/account';

const styles = () => ({
  buttonLine: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'space-around'
  },
  button: {
    width: '100%'
  },
  buttomText: {
    color: grey[500]
  }
});
class LoginForm extends React.Component {
  handleSubmit = values => {
    const state = this.props.location.state;
    return new Promise(resolve => {
      this.props.dispatch({
        type: accountTypes.SAGA_LOGIN_REQUEST,
        resolve,
        values,
        // 如果是从未授权初始页面跳转到login页面，则成功后跳转回去。
        // 如果是以dialog方式跳出的login组件，则返回当前页面
        from: state ? state.from : this.props.location
      });
    });
  };
  render() {
    const { pristine, submitting, error, classes, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <div>{error && <strong>{error}</strong>}</div>
        <div>
          <Field
            name="username"
            component={RenderTextField}
            label="用户名"
            normalize={trim}
            validate={required}
          />
        </div>
        <div>
          <Field
            name="password"
            component={RenderTextField}
            type="password"
            label="密码"
            validate={required}
          />
        </div>
        <div className={classes.buttonLine}>
          <Button
            type="submit"
            variant="raised"
            color="primary"
            disabled={pristine || submitting}
          >
            登录
          </Button>
          <Field name="remember" component={renderSwitch} label="记住我" />
        </div>
        <Typography align="right" className={classes.buttomText}>
          没有账户,
          <Link to="/reg">注册</Link>
        </Typography>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.account.isLoading
});

const enchance = compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps),
  reduxForm({
    form: 'loginForm',
    initialValues: { remember: 'aaa' }
  })
);

export default enchance(LoginForm);
