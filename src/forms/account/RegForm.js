import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {
  syncCheckRegForm,
  asyncCheckUsername,
  shouldAsyncValidate,
  required,
  checkUsername
} from '../../services/validate';
import { trim } from '../../services/normalize';
import { renderTextField } from '../../forms/renderFields';
import { Typography } from '@material-ui/core';

const styles = () => ({
  buttonLine: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'space-around'
  },
  buttomText: {
    color: grey[500]
  }
});

const RegForm = props => {
  const { handleSubmit, pristine, reset, classes, submitting, error } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>{error && <strong>{error}</strong>}</div>
      <div>
        <Field
          name="username"
          component={renderTextField}
          label="用户名"
          asyncCheckFlag
          validate={[required, checkUsername]}
          normalize={trim}
        />
      </div>
      <div>
        <Field
          name="password1"
          component={renderTextField}
          type="password"
          validate={required}
          label="密码"
        />
      </div>
      <div>
        <Field
          name="password2"
          component={renderTextField}
          type="password"
          validate={required}
          label="确认密码"
        />
      </div>
      <div className={classes.buttonLine}>
        <Button
          type="submit"
          variant="raised"
          color="primary"
          disabled={pristine || submitting}
        >
          注册
        </Button>
        <Button
          variant="flat"
          // color="second"
          onClick={reset}
          disabled={pristine || submitting}
        >
          清除
        </Button>
      </div>
      <Typography align="right" className={classes.buttomText}>
        已有账户,
        <Link to="/login">登录</Link>
      </Typography>
    </form>
  );
};

const mapStateToProps = state => ({
  isLoading: state.account.isLoading
});

const enchance = compose(
  withStyles(styles),
  connect(mapStateToProps),
  reduxForm({
    form: 'regForm',
    shouldAsyncValidate,
    validate: syncCheckRegForm,
    asyncValidate: asyncCheckUsername,
    asyncBlurFields: ['username']
  })
);

export default enchance(RegForm);
