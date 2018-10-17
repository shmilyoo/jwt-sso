import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Grid, Button, IconButton } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import { RenderDatePicker, RenderTextField } from '.';
import {
  formatUnixTsToMoment,
  parseMomentToUnixTs
} from '../../services/formatParse';
import { required } from '../../services/validate';

const renderExps = ({ fields }) => {
  console.log('render renderexps');
  return (
    <React.Fragment>
      <Grid item style={{ paddingBottom: '1rem' }}>
        <Button
          variant="fab"
          mini
          color="secondary"
          onClick={() => {
            fields.push({});
          }}
        >
          <Add />
        </Button>
      </Grid>
      {fields.map((exp, index) => (
        <Grid key={index} item container spacing={24} alignItems="baseline">
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
              validate={required}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton
              onClick={() => {
                fields.remove(index);
              }}
            >
              <Delete color="error" />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Grid item />
    </React.Fragment>
  );
};

renderExps.propTypes = {
  label: PropTypes.string, // 不设置trueLabel和falseLabel时显示的文本
  trueLabel: PropTypes.string, // switch为true的时候显示的文本
  falseLabel: PropTypes.string
};

export default renderExps;
