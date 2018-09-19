import React from 'react';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import history from '../../history';
import qs from 'qs';
import { actions as commonActions } from '../../reducers/common';
import BasicInfoForm from '../../forms/account/BasicInfoForm';
import BasicInfoForm1 from '../../forms/account/BasicInfoForm1';

const [tab1, tab2, tab3] = ['basic', 'value1', 'value2'];

class Info extends React.Component {
  constructor(props) {
    super(props);
    props.dispatch(commonActions.changeTitle('用户资料'));
  }
  tabChange = (_event, value) => {
    history.push(`/account/info?type=${value}`);
  };
  render() {
    const { location } = this.props;
    const type =
      qs.parse(location.search, { ignoreQueryPrefix: true }).type || tab1;
    return (
      <div>
        <Tabs
          value={type}
          onChange={this.tabChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="基本" value={tab1} />
          <Tab label="信息1" value={tab2} />
          <Tab label="信息2" value={tab3} />
        </Tabs>
        <div style={{ marginTop: '2rem' }}>
          {type === tab1 && <BasicInfoForm />}
          {type === tab2 && <BasicInfoForm1 />}
          {type === tab3 && 33333333333333333333333}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Info);
