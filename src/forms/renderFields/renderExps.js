import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormControlLabel, Switch, Grid, Button } from '@material-ui/core';
import { RenderDatePicker, RenderTextField } from '.';
import {
  formatUnixTsToMoment,
  parseMomentToUnixTs
} from '../../services/formatParse';
import { required } from '../../services/validate';

const renderExps = ({ fields, meta }) => {
  return (
    <React.Fragment>
      {fields.map((exp, index) => (
        <Grid key={index} item container>
          <Grid item xs={2}>
            <Field
              name={`${exp}.from`}
              component={RenderDatePicker}
              format={formatUnixTsToMoment}
              parse={parseMomentToUnixTs}
              label="起始日期"
              validate={required}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name={`${exp}.to`}
              component={RenderDatePicker}
              format={formatUnixTsToMoment}
              parse={parseMomentToUnixTs}
              nullText="至今"
              canClear={true}
              label="终结日期"
            />
          </Grid>
          <Grid item xs>
            <Field
              name={`${exp}.content`}
              component={RenderTextField}
              label="阶段经历内容"
            />
          </Grid>
          <Grid item xs={1}>
            <Button variant="raised" color="primary">
              保存
            </Button>
            <Button variant="raised" color="primary">
              保存
            </Button>
          </Grid>
        </Grid>
      ))}
    </React.Fragment>
  );
};

renderExps.propTypes = {
  label: PropTypes.string, // 不设置trueLabel和falseLabel时显示的文本
  trueLabel: PropTypes.string, // switch为true的时候显示的文本
  falseLabel: PropTypes.string
};

export default renderExps;
