import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import BasicInfoForm from '../../forms/account/BasicInfoForm';
import { Button } from '@material-ui/core';
import compose from 'recompose/compose';
import { actions as accountActions } from '../../reducers/account';

class InfoBasic extends PureComponent {
  componentDidMount() {
    const { basicInfo, dispatch } = this.props;
    if (!basicInfo) {
      // store中的account basic info还没有获取或者为空，在页面加载的时候获取一次
      dispatch(accountActions.getBasicInfo());
    }
  }

  handleSubmit = values => {
    console.log(JSON.stringify(values));
    return new Promise((resolve, reject) => {
      this.props.dispatch(
        accountActions.updateBasicInfoRequest(resolve, values)
      );
    });
  };
  render() {
    const { basicInfo } = this.props;
    return (
      <div>
        <BasicInfoForm
          enableReinitialize
          onSubmit={this.handleSubmit}
          initialValues={basicInfo}
        />
      </div>
    );
  }
}

InfoBasic.propTypes = {};

function mapStateToProps(state) {
  return {
    basicInfo: state.account.info.basic
  };
}

export default compose(connect(mapStateToProps))(InfoBasic);