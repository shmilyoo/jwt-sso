import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import {
  Menu as MenuIcon,
  Person as UserIcon,
  PowerSettingsNew as LogoutIcon
} from '@material-ui/icons';
import { types as accountTypes } from '../reducers/account';
import compose from 'recompose/compose';

function mapStateToProps(state) {
  return {
    username: state.account.username,
    title: state.common.title
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    logout: () => {
      if (ownProps.type === 'user') {
        dispatch({ type: accountTypes.SAGA_LOGOUT_REQUEST });
      } else {
        this.props.dispatch({ type: accountTypes.SAGA_LOGOUT_REQUEST });
      }
    }
  };
}

const AppHead = ({ onMenuClick, title, logout, color }) => {
  return (
    <AppBar color={color} position="static">
      <Toolbar style={{ display: 'flex' }}>
        <IconButton onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography style={{ flex: 'auto' }} variant="title">
          {title}
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AppHead);
