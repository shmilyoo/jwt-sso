import React from 'react';
import { Field, reduxForm } from 'redux-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Check from '@material-ui/icons/Check';
import blue from '@material-ui/core/colors/blue';

import {
  syncCheckRegForm,
  asyncCheckUsername,
  shouldAsyncValidate
} from '../../services/validate';
import { trimWhiteSpaces } from '../../services/normalize';

const styles = () => ({
  button: {
    width: '100%'
  }
});

//   username.touched && // field has been visited and blurred
//   username.valid &&   // field has no error
//   !asyncValidating;   // not currently validating
const RenderInput = props => {
  const {
    input,
    label,
    asyncCheckFlag,
    meta: { touched, error, valid, asyncValidating },
    ...rest
  } = props;
  if (asyncCheckFlag) {
    return (
      <div>
        <TextField
          label={label}
          error={!!(touched && error)}
          helperText={touched && error}
          {...rest}
          {...input}
        />
        {asyncValidating ? (
          <CircularProgress size={18} style={{ color: blue[400] }} />
        ) : touched && valid && !asyncValidating ? (
          <Check style={{ color: blue[400] }} />
        ) : (
          ''
        )}
      </div>
    );
  }
  return (
    <div>
      <TextField
        label={label}
        error={!!(touched && error)}
        helperText={touched && error}
        {...rest}
        {...input}
      />
    </div>
  );
};

const RegForm = props => {
  const {
    fields,
    handleSubmit,
    pristine,
    reset,
    classes,
    isLoading,
    submitting,
    asyncValidating,
    error
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>{error && <strong>{error}</strong>}</div>
      <div>
        <Field
          name="username"
          component={RenderInput}
          label="用户名"
          asyncCheckFlag
          normalize={trimWhiteSpaces}
        />
      </div>
      <div>
        <Field
          name="password1"
          component={RenderInput}
          type="password"
          label="密码"
        />
      </div>
      <div>
        <Field
          name="password2"
          component={RenderInput}
          type="password"
          label="确认密码"
        />
      </div>
      <div>
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
          color="primary"
          onClick={reset}
          disabled={pristine || submitting}
        >
          清除
        </Button>
      </div>
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
