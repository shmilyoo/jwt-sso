import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import classNames from 'classnames';
import { types as accountTypes } from '../reducers/account';
import {
  withStyles,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  Button,
  IconButton,
  Tooltip
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Person as UserIcon,
  PowerSettingsNew as LogoutIcon
} from '@material-ui/icons';

const drawerWidth = 200;

const style = theme => ({
  homeRoot: {
    height: '100%',
    width: '100%'
  },
  left: {
    height: '100%'
  },
  leftPage: {
    width: drawerWidth,
    position: 'relative'
  },
  leftHeader: {
    height: 64
  },
  right: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    height: '100%',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  rightShift: {
    width: '100%',
    marginLeft: 0
  },
  main: {
    flex: 'auto'
  },
  footer: {}
});

class Home extends React.Component {
  state = {
    open: true
  };
  logout = () => {
    this.props.dispatch({ type: accountTypes.SAGA_LOGOUT_REQUEST });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.homeRoot}>
        <div className={classes.left}>
          <Drawer
            classes={{ paper: classes.leftPage }}
            variant="persistent"
            open={this.state.open}
          >
            <div className={classes.leftHeader}>left-header</div>
            <Divider />
            <List>aaa</List>
            <List>aaa</List>
          </Drawer>
        </div>
        <div
          className={classNames(classes.right, {
            [classes.rightShift]: !this.state.open
          })}
        >
          <div className={classes.header}>
            <AppBar color="secondary" position="static">
              <Toolbar style={{ display: 'flex' }}>
                <IconButton
                  onClick={() => {
                    this.setState({ open: !this.state.open });
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography style={{ flex: 'auto' }} variant="title">
                  Photos
                </Typography>
                <IconButton>
                  <UserIcon />
                </IconButton>
                <Tooltip title="注销">
                  <IconButton onClick={this.logout}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </AppBar>
          </div>
          <div className={classes.main}>main</div>
          <div className={classes.footer}>foot</div>
        </div>
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
  withStyles(style),
  connect(mapStateToProps)
)(Home);
