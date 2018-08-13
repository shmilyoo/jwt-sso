import React from 'react';
import { connect } from 'react-redux';

class Login extends React.Component {
  render() {
    return <div>Login-- {this.props.user}</div>;
  }
}

function mapStateToProps(state) {
  return {
    user: state.account.user
  };
}

export default connect(mapStateToProps)(Login);
