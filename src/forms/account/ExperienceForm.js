import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, Fields, FieldArray } from 'redux-form';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { required } from '../../services/validate';
import { trim } from '../../services/normalize';
import { Button, Typography, Grid, Divider } from '@material-ui/core';
import {
  RenderTextField,
  RenderSwitch,
  RenderDatePicker,
  RenderExps
} from '../renderFields';
import grey from '@material-ui/core/colors/grey';
import {
  formatUnixTsToMoment,
  parseMomentToUnixTs
} from '../../services/formatParse';
import renderExps from '../renderFields/renderExps';

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
const ExperienceForm = props => {
  const { pristine, submitting, error, classes, handleSubmit, exps } = props;
  console.log('Experience form render');
  const maxDate = `${new Date().getFullYear() - 1}-12-31`;
  return (
    <form onSubmit={handleSubmit}>
      <Grid direction="column" container>
        <Grid item container spacing={24}>
          <Grid item xs={2}>
            <Field
              name="from"
              component={RenderDatePicker}
              minDate="1900-01-01"
              maxDate={maxDate}
              format={formatUnixTsToMoment}
              parse={parseMomentToUnixTs}
              label="起始日期"
              validate={required}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name="to"
              component={RenderDatePicker}
              minDate="1900-01-01"
              maxDate={maxDate}
              format={formatUnixTsToMoment}
              parse={parseMomentToUnixTs}
              nullText="至今"
              canClear={true}
              label="终结日期"
            />
          </Grid>
          <Grid item xs>
            <Field
              name="content"
              component={RenderTextField}
              label="阶段经历内容"
            />
          </Grid>
          <Grid item xs={1}>
            <Button variant="raised" color="primary">
              添加
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <FieldArray name="exps" component={renderExps} />
      </Grid>
    </form>
  );
};

export default compose(
  withStyles(styles),
  reduxForm()
)(ExperienceForm);
