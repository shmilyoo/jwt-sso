// @flow
import React from 'react';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import RegForm from '../components/forms/RegForm';
import { SubmissionError } from 'redux-form';
import { sleep } from '../services/utility';
import { types as accountTypes } from '../reducers/account';
import { actions as accountActions } from '../reducers/account';
import { Card, withStyles, CardContent, Typography } from '@material-ui/core';
import compose from 'recompose/compose';

const styles = theme => ({
  card: {
    width: '30rem',
    margin: 'auto'
  },
  container: {
    height: '100%',
    display: 'flex'
    // justifyContent: "center",
    // alignItems: "center"
  },
  title: theme.typography.title3
});

class Reg extends React.Component {
  handleSubmit = values => {
    return new Promise(resolve => {
      this.props.dispatch({
        type: accountTypes.SAGA_REG_REQUEST,
        resolve,
        values
      });
    });
  };

  render() {
    const { classes, username } = this.props;
    return (
      <div className={classes.container}>
        {username ? (
          <Redirect to="/" />
        ) : (
          <Card className={classes.card}>
            <CardContent>
              <Typography align="center" className={classes.title}>
                注册
              </Typography>
              <RegForm onSubmit={this.handleSubmit} />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.account.username
  };
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(Reg);
