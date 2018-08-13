// @flow
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import RegForm from '../components/forms/RegForm';
import { SubmissionError } from 'redux-form';
import { sleep } from '../services/utility';

class Reg extends React.Component {
  handleSubmit = values => {
    console.log('reg.js handlesubmit');
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'saga-submit',
        resolve,
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
