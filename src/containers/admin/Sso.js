import React, { PureComponent } from 'react';
import { SubmissionError } from 'redux-form';
import SsoForm from '../../forms/admin/SsoForm';
import {
  Divider,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  IconButton
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import axios from 'axios';

class Sso extends PureComponent {
  state = {
    ssoList: [],
    mode: 'add',
    initEditSso: {}
  };
  componentDidMount() {
    this.updateSsoList();
  }
  editSsoClick = index => {
    const sso = this.state.ssoList[index];

    this.setState({ mode: 'edit', initEditSso: sso });
  };
  delSsoClick = index => {
    const { id } = this.state.ssoList[index];
    axios.post('/sso/delete', { id }).then(res => {
      if (res.success) {
        if (this.state.mode === 'edit' && this.state.initEditSso.id === id) {
          this.setState({ initEditSso: {}, ssoList: res.data });
        } else {
          this.setState({ ssoList: res.data });
        }
      }
    });
  };
  toAddMode = () => {
    this.setState({ mode: 'add', initEditSso: {} });
  };
  updateSsoList = () => {
    axios.get('/sso/all').then(res => {
      if (res.success) {
        this.setState({ ssoList: res.data });
      }
    });
  };
  handleSubmit = values => {
    return new Promise((resolve, reject) => {
      axios
        .post(this.state.mode === 'add' ? '/sso/add' : '/sso/update', values)
        .then(res => {
          if (res.success) {
            if (this.state.mode === 'edit') {
              this.setState({ initEditSso: values, ssoList: res.data });
            } else {
              this.setState({ ssoList: res.data });
            }
            resolve();
          } else {
            reject(new SubmissionError({ _error: res.error }));
          }
        });
    });
  };
  render() {
    const { ssoList, mode, initEditSso } = this.state;
    return (
      <div style={{ width: '100%' }}>
        <div>
          <SsoForm
            initialValues={initEditSso}
            enableReinitialize
            mode={mode}
            onSubmit={this.handleSubmit}
            onToAddModeClick={this.toAddMode}
          />
        </div>
        <Divider style={{ marginTop: '2rem' }} />
        {ssoList.length > 0 && (
          <Table padding="checkbox">
            <TableHead>
              <TableRow>
                <TableCell>系统名</TableCell>
                <TableCell>系统代号</TableCell>
                <TableCell>认证密码</TableCell>
                {/* <TableCell>系统来源</TableCell> */}
                <TableCell>更新部门API</TableCell>
                <TableCell>系统介绍</TableCell>
                <TableCell style={{ width: '15rem' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {ssoList.map((sso, index) => (
                <TableRow key={sso.id}>
                  <TableCell scope="row">{sso.name}</TableCell>
                  <TableCell>{sso.symbol}</TableCell>
                  <TableCell>{sso.code}</TableCell>
                  {/* <TableCell>{sso.origins.split(';').join('  ')}</TableCell> */}
                  <TableCell>{sso.intro}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => this.editSsoClick(index)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        this.delSsoClick(index);
                      }}
                    >
                      <Delete />
                    </IconButton>
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

Sso.propTypes = {};

export default Sso;
