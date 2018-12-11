import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography } from '@material-ui/core';
import history from '../../history';
import qs from 'qs';
import compose from 'recompose/compose';

const style = theme => ({
  root: {
    height: '90%'
  },
  link: {
    ...theme.sharedClass.link,
    marginLeft: '1rem'
  }
});

class CountDownRedirect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      to: '/'
    };
  }
  componentDidMount() {
    const { content, to, count = 5 } = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    this.setState({ content, to, countDown: count });
    this.timer = setInterval(this.count, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  count = () => {
    this.setState({ countDown: this.state.countDown - 1 });
  };
  redirect = () => {
    const to = this.state.to;
    if (to.startsWith('http://') || to.startsWith('https://')) {
      global.location = to;
    } else history.push(to);
  };

  render() {
    const { classes } = this.props;
    const { countDown, content } = this.state;
    if (countDown === 0) {
      clearInterval(this.timer);
      this.redirect();
    }
    return (
      <Grid
        className={classes.root}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item xs={4} />
        <Grid item xs={4} container justify="center" spacing={24}>
          <Grid item>{countDown}</Grid>
          <Grid item xs container direction="column">
            <Grid item>{content}</Grid>
            <Grid item container>
              <Grid item>
                <Typography>正在为您跳转到目标页,</Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.link} onClick={this.redirect}>
                  直接跳转
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  className={classes.link}
                  onClick={() => {
                    history.push('/');
                  }}
                >
                  首页
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  className={classes.link}
                  onClick={() => {
                    history.push('/reg');
                  }}
                >
                  注册
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  className={classes.link}
                  onClick={() => {
                    history.push('/login');
                  }}
                >
                  登录
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} />
      </Grid>
    );
  }
}

export default compose(withStyles(style))(CountDownRedirect);
