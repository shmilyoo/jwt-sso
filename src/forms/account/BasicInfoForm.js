import React from 'react';
import { connect } from 'react-redux';
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
import { formatSex, parseSex } from '../../services/formatParse';

const styles = {};

class BasicInfoForm extends React.Component {
  handleSubmit = values => {
    // username,
    // sex,
    // birthday,
    // nation,
    // idCard,
    // idCard2,
    // nativePlace,
    // dept,
    // married
    console.log(`info form submit,values is ${JSON.stringify(values)}`);
  };
  render() {
    console.log('basic info form render');
    const { pristine, submitting, error, reset, handleSubmit } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <Grid container spacing={16} alignItems="flex-end">
            {error && (
              <Grid item xs={12}>
                <strong>{error}</strong>
              </Grid>
            )}
            <Grid item xs={3} sm={1}>
              <Field
                name="username"
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
            <Grid item xs={3} sm={1}>
              <Field
                name="birthday"
                label="出生日期"
                minDate="1900-01-01"
                maxDate={`${new Date().getFullYear() - 1}-12-31`}
                component={RenderDatePicker}
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
                label="工作单位"
                component={RenderSelectDeptField}
                validate={required}
              />
            </Grid>
          </Grid>
          <div>
            <Button
              type="submit"
              variant="raised"
              color="primary"
              disabled={pristine || submitting}
            >
              保存
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

function mapStateToProps(state) {
  return {
    initialValues: {
      username: '112121',
      sex: 1,
      birthday: '2017-12-26'
    }
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getBasicInfo: () => {}
  };
}

const enchance = compose(
  withStyles(styles),
  connect(mapStateToProps),
  reduxForm({
    form: 'basicInfoForm'
    // shouldAsyncValidate,
    // validate: syncCheckRegForm,
    // asyncValidate: asyncCheckUsername,
    // asyncBlurFields: ['username']
  })
);

export default enchance(BasicInfoForm);
