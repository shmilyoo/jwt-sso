import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { required } from '../../services/validate';
import { trim } from '../../services/normalize';
import { RenderTextField } from '../../forms/renderFields';
import { Grid } from '@material-ui/core';

const styles = () => ({});

const SsoForm = ({
  mode,
  handleSubmit,
  pristine,
  reset,
  submitting,
  onToAddModeClick
}) => {
  console.log('sso form render');
  return (
    <Grid container direction="column">
      <form onSubmit={handleSubmit}>
        <Grid item container spacing={24}>
          <Grid item xs={2}>
            <Field
              name="name"
              component={RenderTextField}
              label="系统名称"
              validate={required}
              normalize={trim}
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              name="symbol"
              component={RenderTextField}
              label="系统代号"
              title="最多8个字符，字母或数字"
              validate={required}
              normalize={trim}
            />
          </Grid>
          <Grid item xs>
            <Field
              name="origins"
              component={RenderTextField}
              validate={required}
              label="限定系统来源origin(ip:port)，以;分隔，*代表不限制ip地址来源"
            />
          </Grid>
        </Grid>
        <Grid item>
          <Field
            name="intro"
            component={RenderTextField}
            normalize={trim}
            label="系统介绍"
          />
        </Grid>
        <Grid item container spacing={32} justify="center">
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={pristine || submitting}
            >
              {mode === 'add' ? '添加' : '保存'}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              onClick={reset}
              disabled={pristine || submitting}
            >
              清除
            </Button>
          </Grid>
          {mode === 'edit' ? (
            <Grid item>
              <Button variant="text" onClick={onToAddModeClick}>
                添加
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </form>
    </Grid>
  );
};

SsoForm.propTypes = {
  mode: PropTypes.oneOf(['add', 'edit'])
};

SsoForm.defaultProps = {
  mode: 'add'
};

const enchance = compose(
  withStyles(styles),
  reduxForm({
    form: 'ssoForm'
  })
);

export default enchance(SsoForm);
