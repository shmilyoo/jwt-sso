import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles, Grid, Typography } from '@material-ui/core';
import history from '../../history';
import compose from 'recompose/compose';
import qs from 'qs';

const style = theme => ({
  root: {
    height: '100%'
  },
  link: theme.sharedClass.link
});

class CountDownRedirect extends PureComponent {
  constructor(props) {
    super(props);
    const { content, redirect, countDown } = qs.parse(
      this.props.location.search,
      { ignoreQueryPrefix: true }
    );
    this.state = {
      countDown: Number.parseInt(countDown) || 5,
      content: content || '发生错误',
      redirect: redirect || '/'
    };
  }
  componentDidMount() {
    this.timer = setInterval(this.count, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  count = () => {
    this.setState({ countDown: this.state.countDown - 1 });
  };
  redirect = () => {
    const redirect = this.state.redirect;
    redirect.includes('http')
      ? (global.location = redirect)
      : history.push(redirect);
  };
  render() {
    const { classes } = this.props;
    const { content, countDown } = this.state;
    if (countDown === 0) {
      clearInterval(this.timer);
      this.redirect();
    }
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid item xs={1} />
        <Grid item xs={2}>
          {countDown}
        </Grid>
        <Grid item xs>
          <div>
            <Typography>{content}</Typography>
          </div>
          <div>
            <Typography>
              直接
              <Link to="#" onClick={this.redirect}>
                点击此处
              </Link>
              跳转
            </Typography>
          </div>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    );
  }
}

CountDownRedirect.propTypes = {
  redirect: PropTypes.string.isRequired,
  seconds: PropTypes.number
};

CountDownRedirect.defaultValue = {
  countDown: 5
};

export default compose(withStyles(style))(CountDownRedirect);
