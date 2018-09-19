import React from 'react';
import { withStyles } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import compose from 'recompose/compose';

const styles = {};

class BasicInfoForm1 extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = values => {};
  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit(this.handleSubmit)} />
      </div>
    );
  }
}

const enchance = compose(
  withStyles(styles),
  // connect(mapStateToProps),
  reduxForm({
    form: 'basicInfoForm1'
    // shouldAsyncValidate,
    // validate: syncCheckRegForm,
    // asyncValidate: asyncCheckUsername,
    // asyncBlurFields: ['username']
  })
);

export default enchance(BasicInfoForm1);
