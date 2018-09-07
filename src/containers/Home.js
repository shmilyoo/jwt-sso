import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  handle = event => {
    console.log(event);
    console.log(typeof event.currentTarget);
  };

  render() {
    return (
      <div>
        Home-- {JSON.stringify(this.props.username)}
        <Link to={'reg'}>reg-link</Link>
        <div>
          <button onClick={this.handle}>button</button>
        </div>
        <div>{this.props.children}</div>
        <Link to="/login">登录</Link>
        <Link to="/reg">注册</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.account.username
  };
}

export default withRouter(connect(mapStateToProps)(Home));
