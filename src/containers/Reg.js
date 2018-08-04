// @flow
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import RegForm from '../components/forms/RegForm';
import { SubmissionError } from 'redux-form';
import { sleep } from '../services/utility';

type Props = {
  user?: string,
  dispatch: Function
};

class Reg extends React.Component<Props> {
  handleSubmit = values => {
    // event.preventDefault();
    console.log('reg.js handlesubmit');
    // return sleep(1000).then(() => {

    // throw new SubmissionError({
    //   username: "User does not exist",
    //   _error: "Login failed!"
    // });
    // });
    return new Promise((resolve, reject) => {
      this.props.dispatch({
        type: 'saga-submit',
        resolve,
        reject,
        data: [1, 2]
      });
    });
  };
  render() {
    return (
      <div>
        <RegForm onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.account.user
  };
}

export default connect(mapStateToProps)(Reg);
