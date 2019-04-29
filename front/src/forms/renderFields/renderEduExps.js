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
import { trim } from '../../services/normalize';

// id
// userId: { type: CHAR(32) },
// name: { type: STRING(16) }, // 名称，小学 中学 高中 本科 研究生等
// from: { type: INTEGER }, // 起始日期
// to: { type: INTEGER, allowNull: true }, // 结束日期 null 代表至今
// school: { type: STRING(32) }, // 教育经历所在地点
// degree: { type: STRING(16), defaultValue: '' }, // 学位
// major: { type: STRING(32), defaultValue: '' }, // 所学专业
// authenticator: { type: STRING(16), defaultValue: '' }, // 证明人

const renderEduExps = ({ fields }) => {
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
        <Grid key={index} item container spacing={8} alignItems="center">
          <Grid item xs={1}>
            <Field
              name={`${exp}.name`}
              component={RenderTextField}
              label="名称*"
              title="填写小学、中学、大学等"
              normalize={trim}
              validate={required}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name={`${exp}.from`}
              component={RenderDatePicker}
              format={formatUnixTsToMoment}
              parse={parseMomentToUnixTs}
              label="起始日期*"
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
          <Grid item xs={2}>
            <Field
              name={`${exp}.school`}
              component={RenderTextField}
              label="学校/地点*"
              normalize={trim}
              validate={required}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name={`${exp}.major`}
              component={RenderTextField}
              label="专业"
              normalize={trim}
            />
          </Grid>
          <Grid item xs={1}>
            <Field
              name={`${exp}.degree`}
              component={RenderTextField}
              label="学位"
              title="填写学位、证书等"
              normalize={trim}
            />
          </Grid>
          <Grid item xs={1}>
            <Field
              name={`${exp}.authenticator`}
              component={RenderTextField}
              label="证明人"
              normalize={trim}
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

renderEduExps.propTypes = {
  label: PropTypes.string, // 不设置trueLabel和falseLabel时显示的文本
  trueLabel: PropTypes.string, // switch为true的时候显示的文本
  falseLabel: PropTypes.string
};

export default renderEduExps;
