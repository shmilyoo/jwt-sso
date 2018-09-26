import React from 'react';
import { reduxForm } from 'redux-form';
import { Field } from 'redux-form';
import { Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {
  required,
  shouldAsyncValidate,
  syncCheckDeptForm,
  asyncCheckDeptSymbol
} from '../../services/validate';
import { trim } from '../../services/normalize';
import { renderTextField } from '../renderFields';
import compose from 'recompose/compose';

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

const DeptForm = props => {
  const {
    mode,
    handleSubmit,
    pristine,
    reset,
    classes,
    submitting,
    error,
    data
  } = props;
  console.log('dept form render');
  return (
    <form onSubmit={handleSubmit}>
      <Grid item container spacing={16}>
        <Grid item>
          <Field
            name="name"
            component={renderTextField}
            label="节点名称"
            validate={required}
            normalize={trim}
            title="节点的名称，最多32个字符"
          />
        </Grid>
        <Grid item>
          <Field
            name="symbol"
            component={renderTextField}
            asyncCheckFlag={mode === 'add'}
            validate={required}
            normalize={trim}
            disabled={mode !== 'add'}
            label="节点代号"
            title="节点的字母缩写，最多16个字符"
          />
        </Grid>
        <Grid item>
          <Field
            name="parent"
            component={renderTextField}
            disabled
            label="上级节点"
          />
        </Grid>
      </Grid>
      <Grid item>
        <Field
          name="intro"
          component={renderTextField}
          normalize={trim}
          label="节点介绍"
          multiline
          title="节点的介绍，最多64个字符"
        />
      </Grid>
      <Grid item container justify="center" spacing={24}>
        <Grid item>
          <Button
            type="submit"
            variant="raised"
            color="primary"
            disabled={pristine || submitting}
          >
            {mode === 'add' ? '添加' : '更新'}
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="flat"
            onClick={reset}
            disabled={pristine || submitting}
          >
            重置
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default compose(
  withStyles(styles),
  reduxForm({
    shouldAsyncValidate,
    validate: syncCheckDeptForm,
    asyncValidate: asyncCheckDeptSymbol,
    asyncBlurFields: ['symbol']
  })
)(DeptForm);

// export default withStyles(styles)(DeptForm);
