import React from 'react';
import { Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Button,
  Grid,
  TextField
} from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import {
  renderTextField,
  renderInputSelect,
  RenderDatePicker
} from '../renderFields';
import { required } from '../../services/validate';
import { trim } from '../../services/normalize';

const styles = {};

class BasicInfoForm extends React.Component {
  constructor(props) {
    super(props);
  }
  handleSubmit = values => {};
  render() {
    const {
      pristine,
      submitting,
      error,
      reset,
      classes,
      handleSubmit
    } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <Grid container spacing={8}>
            {error && (
              <Grid item xs={12}>
                <strong>{error}</strong>
              </Grid>
            )}
            <Grid item xs={3} sm={2}>
              <Field
                name="username"
                component={renderTextField}
                mode="edit"
                label="姓名"
                validate={required}
                normalize={trim}
              />
            </Grid>
            <Grid item xs={3} sm={2}>
              <Field
                name="sex"
                label="性别"
                data={[
                  { label: '男', value: 'male' },
                  { label: '女', value: 'female' }
                ]}
                component={renderInputSelect}
                validate={required}
              />
            </Grid>
            <Grid item xs={3} sm={2}>
              <Field
                name="birthday"
                label="出生日期"
                minDate="1900-01-01"
                maxDate={`${new Date().getFullYear() - 1}-12-31`}
                component={RenderDatePicker}
                validate={required}
              />
            </Grid>
            <Grid item xs={3} sm={2} />
          </Grid>
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
              // color="second"
              onClick={reset}
              disabled={pristine || submitting}
            >
              清除
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

const enchance = compose(
  withStyles(styles),
  // connect(mapStateToProps),
  reduxForm({
    form: 'basicInfoForm',
    initialValues: { username: '发大幅度发' }
    // shouldAsyncValidate,
    // validate: syncCheckRegForm,
    // asyncValidate: asyncCheckUsername,
    // asyncBlurFields: ['username']
  })
);

export default enchance(BasicInfoForm);
