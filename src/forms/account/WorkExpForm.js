import React from 'react';
import { reduxForm, FieldArray } from 'redux-form';
import compose from 'recompose/compose';
import { Button, Grid, withStyles } from '@material-ui/core';
import renderEduExps from '../renderFields/renderEduExps';
import classnames from 'classnames';

const style = {
  hide: {
    display: 'none'
  }
};

const ExperienceForm = props => {
  const { pristine, submitting, reset, handleSubmit, classes } = props;
  console.log('Experience form render');
  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column">
        <FieldArray name="exps" component={renderEduExps} />
        <Grid
          item
          container
          justify="center"
          spacing={32}
          className={classnames({ [classes.hide]: pristine })}
        >
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={pristine || submitting}
            >
              保存
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              disabled={pristine || submitting}
              onClick={reset}
            >
              重置
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default compose(
  withStyles(style),
  reduxForm()
)(ExperienceForm);
