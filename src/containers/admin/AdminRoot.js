import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import compose from 'recompose/compose';
import classNames from 'classnames';
import { types as accountTypes } from '../../reducers/account';
import {
  withStyles,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Person as UserIcon,
  PowerSettingsNew as LogoutIcon
} from '@material-ui/icons';
import LeftNav from '../../components/LeftNav';
import Info from '../account/Info';
import { adminLeftMenu } from '../../config';

const drawerWidth = 250;

const style = theme => ({
  homeRoot: {
    height: '100%',
    width: '100%'
  },

  right: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    height: '100%'
  },
  rightShift: {
    width: '100%',
    marginLeft: 0
  },
  main: {
    padding: 20,
    flex: 'auto'
  },
  white: {
    color: 'white'
  }
});

class AdminRoot extends React.Component {
  logout = () => {
    this.props.dispatch({ type: accountTypes.SAGA_LOGOUT_REQUEST });
  };

  render() {
    console.log('render admin root');
    const { classes, title } = this.props;
    return (
      <div className={classes.homeRoot}>
        <LeftNav menu={adminLeftMenu} open={true} header="后台管理" />
        <div className={classes.right}>
          <div className={classes.header}>
            <AppBar color="secondary" position="static">
              <Toolbar style={{ display: 'flex' }}>
                <IconButton>
                  <MenuIcon />
                </IconButton>
                <Typography style={{ flex: 'auto' }} variant="title">
                  {title}
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
          <div className={classes.main}>
            <Switch>
              <Route path="/admin/dept" component={Info} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    adminName: state.account.adminName,
    title: state.common.title
  };
}

export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(AdminRoot);
