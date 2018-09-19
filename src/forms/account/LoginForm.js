import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { required } from '../../services/validate';
import { trim } from '../../services/normalize';
import { Button, Typography } from '@material-ui/core';
import { renderTextField, renderSwitch } from '../../forms/renderFields';
import grey from '@material-ui/core/colors/grey';

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
const LoginForm = props => {
  const { pristine, submitting, error, classes, admin, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>{error && <strong>{error}</strong>}</div>
      <div>
        <Field
          name="username"
          autoFocus
          component={renderTextField}
          label="用户名"
          normalize={trim}
          validate={required}
        />
      </div>
      <div>
        <Field
          name="password"
          component={renderTextField}
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
        <Link to={admin ? '/admin/reg' : '/reg'}>
          {admin ? '申请管理员' : '注册'}
        </Link>
      </Typography>
    </form>
  );
};

// const enchance = compose(
//   // withRouter,
//   withStyles(styles),
//   reduxForm({
//     form: 'loginForm',
//     initialValues: { remember: 'aaa' }
//   })
// );

// export default enchance(LoginForm);
export default withStyles(styles)(LoginForm);
