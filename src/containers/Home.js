import React from 'react';
import { connect } from 'react-redux';
import Login from './Login';

class Home extends React.Component {
  handle = event => {
    console.log(event);
    console.log(typeof event.currentTarget);
  };

  render() {
    return (
      <div>
        Home-- {this.props.user}
        <div>
          <button onClick={this.handle}>button</button>
        </div>
        <div>{this.props.children}</div>
        <Login />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.account.user
  };
}

export default connect(mapStateToProps)(Home);
