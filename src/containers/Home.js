// @flow
import React from 'react';
import type { Node as ReactNode } from 'react';
import { connect } from 'react-redux';
import Login from './Login';

type props = {
  user?: string,
  a: any,
  children?: ReactNode
};
class Home extends React.Component<props> {
  handle = (event: SyntheticEvent<HTMLButtonElement>) => {
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
