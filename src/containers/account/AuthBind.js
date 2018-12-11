import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { types as accountTypes } from '../../reducers/account';
import {
  Button,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  withStyles
} from '@material-ui/core';
import classNames from 'classnames';

const style = theme => ({
  btnRevoke: { ...theme.sharedClass.errorBtn },
  btnAgree: {
    ...theme.sharedClass.infoBtn
  }
});

class AuthBind extends PureComponent {
  componentDidMount() {
    if (!this.props.binds) {
      this.props.getBinds();
    }
  }

  toggleBind = (id, agreed) => {
    this.props.toggleBind(id, agreed);
  };

  render() {
    const { binds, classes } = this.props;
    return (
      <div>
        {binds &&
          binds.length > 0 && (
            <Table padding="checkbox">
              <TableHead>
                <TableRow>
                  <TableCell>序号</TableCell>
                  <TableCell>系统代号</TableCell>
                  <TableCell>第三方系统用户名</TableCell>
                  <TableCell style={{ width: '15rem' }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {binds.map((bind, index) => (
                  <TableRow key={bind.id}>
                    <TableCell scope="row">{index}</TableCell>
                    <TableCell>{bind.ssoSymbol}</TableCell>
                    <TableCell>{bind.ssoUsername}</TableCell>
                    <TableCell>
                      <Button
                        className={classNames({
                          [classes.btnAgree]: !bind.agreed,
                          [classes.btnRevoke]: bind.agreed
                        })}
                        variant="contained"
                        size="small"
                        onClick={() => {
                          bind.disabled = true;
                          this.toggleBind(bind.id, bind.agreed);
                        }}
                      >
                        {bind.agreed ? '撤销' : '同意'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { binds: state.account.binds };
}

function mapDispatchToprops(dispatch) {
  return {
    getBinds: () => {
      dispatch({ type: accountTypes.SAGA_GET_BINDS_REQUEST });
    },
    toggleBind: (id, agreed) => {
      dispatch({ type: accountTypes.SAGA_TOGGLE_BIND_REQUEST, id, agreed });
    }
  };
}

AuthBind.propTypes = {};

export default compose(
  withStyles(style),
  connect(
    mapStateToProps,
    mapDispatchToprops
  )
)(AuthBind);
