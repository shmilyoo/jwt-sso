import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import {
  Menu as MenuIcon,
  Person as UserIcon,
  PowerSettingsNew as LogoutIcon
} from '@material-ui/icons';
import { types as accountTypes } from '../reducers/account';
import compose from 'recompose/compose';
import { pathTitle, sysName } from '../config';

function mapStateToProps(state) {
  return {
    username: state.account.username
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    logout: () => {
      if (ownProps.type === 'user') {
        dispatch({ type: accountTypes.SAGA_LOGOUT_REQUEST });
      } else {
        dispatch({ type: accountTypes.SAGA_LOGOUT_REQUEST });
      }
    }
  };
}

const AppHead = ({ onMenuClick, logout, color, location: { pathname } }) => {
  document.title = `${pathTitle[pathname]} - ${sysName}`;
  return (
    <AppBar color={color} position="static">
      <Toolbar style={{ display: 'flex' }}>
        <IconButton onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography style={{ flex: 'auto' }} variant="title">
          {pathTitle[pathname]}
        </Typography>
        <IconButton>
          <UserIcon />
        </IconButton>
        <IconButton title="注销" onClick={logout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

AppHead.propTypes = {
  onMenuClick: PropTypes.func,
  title: PropTypes.string,
  logout: PropTypes.func,
  color: PropTypes.string,
  type: PropTypes.oneOf(['user', 'admin'])
};

AppHead.defaultProps = {
  color: 'secondary',
  type: 'user'
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AppHead);
