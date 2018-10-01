import React from 'react';
import { connect } from 'react-redux';
import { actions as commonAction } from '../reducers/common';
import compose from 'recompose/compose';
import { withStyles, Snackbar, SnackbarContent } from '@material-ui/core';

function mapStateToProps(state) {
  return {
    showMessage: state.common.showMessage,
    message: state.common.message,
    messageType: state.common.messageType
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeMessage: () => {
      dispatch(commonAction.closeMessage());
    }
  };
}
const styles = theme => ({
  info: {
    backgroundColor: theme.palette.info.main
  },
  warn: {
    backgroundColor: theme.palette.warn.main
  },
  error: {
    backgroundColor: theme.palette.error.main
  }
});
const Message = ({
  classes,
  showMessage,
  messageType,
  message,
  closeMessage
}) => {
  return (
    <Snackbar
      open={showMessage}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      autoHideDuration={3000}
      onClose={closeMessage}
    >
      <SnackbarContent
        className={classes[messageType]}
        message={<strong>{message}</strong>}
      />
    </Snackbar>
  );
};
export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Message);
