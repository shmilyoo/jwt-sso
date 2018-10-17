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
              this.setState({ initEditSso: values });
            }
            this.updateSsoList();
            resolve();
          } else {
            reject(new SubmissionError({ name: 'aaa', _error: 'bbb' }));
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>系统名</TableCell>
                <TableCell>系统代号</TableCell>
                <TableCell>系统来源</TableCell>
                <TableCell>系统介绍</TableCell>
                <TableCell style={{ width: '5rem' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {ssoList.map((sso, index) => (
                <TableRow key={sso.id}>
                  <TableCell component="th" scope="row">
                    {sso.name}
                  </TableCell>
                  <TableCell>{sso.symbol}</TableCell>
                  <TableCell>{sso.origins.split(';').join('  ')}</TableCell>
                  <TableCell>{sso.intro}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => this.editSsoClick(index)}>
                      <Edit />
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
