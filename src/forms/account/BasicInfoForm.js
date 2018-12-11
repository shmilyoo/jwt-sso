import React from 'react';
import { withStyles, Button, Grid } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';
import {
  RenderTextField,
  RenderInputSelect,
  RenderDatePicker,
  RenderSwitch,
  RenderSelectDeptField
} from '../renderFields';
import { required } from '../../services/validate';
import { trim } from '../../services/normalize';
import {
  formatSex,
  parseSex,
  formatUnixTsToMoment,
  parseMomentToUnixTs
} from '../../services/formatParse';

const styles = {};

const BasicInfoForm = ({
  pristine,
  submitting,
  error,
  reset,
  handleSubmit
}) => {
  console.log('basic info form render');
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={16} alignItems="flex-end">
          {error && (
            <Grid item xs={12}>
              <strong>{error}</strong>
            </Grid>
          )}
          <Grid item xs={3} sm={1}>
            <Field
              name="name"
              component={RenderTextField}
              label="姓名"
              validate={required}
              normalize={trim}
            />
          </Grid>
          <Grid item xs={3} sm={1}>
            <Field
              name="sex"
              label="性别"
              data={[
                { label: '男', value: 'male' },
                { label: '女', value: 'female' }
              ]}
              component={RenderInputSelect}
              format={formatSex}
              parse={parseSex}
              validate={required}
            />
          </Grid>
          <Grid item xs={3} sm={1}>
            <Field
              name="nation"
              label="民族"
              component={RenderTextField}
              validate={required}
              normalize={trim}
            />
          </Grid>
          <Grid item xs={3} sm={2}>
            <Field
              name="birthday"
              label="出生日期"
              minDate="1900-01-01"
              maxDate={`${new Date().getFullYear() - 1}-12-31`}
              component={RenderDatePicker}
              format={formatUnixTsToMoment}
              parse={parseMomentToUnixTs}
              validate={required}
            />
          </Grid>
          <Grid item xs={3} sm={2}>
            <Field
              name="idCard"
              label="身份证"
              component={RenderTextField}
              validate={required}
              normalize={trim}
            />
          </Grid>
          <Grid item xs={3} sm={2}>
            <Field
              name="idCard2"
              label="证件二"
              component={RenderTextField}
              validate={required}
              normalize={trim}
            />
          </Grid>
          <Grid item xs={3} sm={1}>
            <Field
              name="nativePlace"
              label="籍贯"
              component={RenderTextField}
              validate={required}
              normalize={trim}
            />
          </Grid>
          <Grid item xs={3} sm={2}>
            <Field
              name="phone"
              label="电话"
              component={RenderTextField}
              normalize={trim}
            />
          </Grid>
          <Grid item xs={3} sm={2}>
            <Field
              name="married"
              trueLabel="已婚"
              falseLabel="未婚"
              component={RenderSwitch}
              labelPlacement="end"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Field
              name="dept"
              label="工作单位(组织关系)"
              component={RenderSelectDeptField}
              validate={required}
            />
          </Grid>
        </Grid>
        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={pristine || submitting}
          >
            保存
          </Button>
          <Button
            variant="text"
            onClick={reset}
            disabled={pristine || submitting}
          >
            清除
          </Button>
        </div>
      </form>
    </div>
  );
};

const enchance = compose(
  withStyles(styles),
  reduxForm({
    form: 'basicInfoForm'
    // shouldAsyncValidate,
    // validate: syncCheckRegForm,
    // asyncValidate: asyncCheckUsername,
    // asyncBlurFields: ['username']
  })
);

export default enchance(BasicInfoForm);
