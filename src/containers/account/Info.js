import React from 'react';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import history from '../../history';
import qs from 'qs';
import { actions as commonActions } from '../../reducers/common';
import BasicInfoForm from '../../forms/account/BasicInfoForm';
import RegForm from '../../forms/account/RegForm';

// const [tab1, tab2, tab3, tab4] = ['basic', 'education', 'work', 'family'];
const tabs = {
  tab1: { label: '基本资料', value: 'basic', component: BasicInfoForm },
  tab2: { label: '教育经历', value: 'education', component: RegForm },
  tab3: { label: '工作经历', value: 'work' },
  tab4: { label: '家庭关系', value: 'family' }
};

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
      qs.parse(location.search, { ignoreQueryPrefix: true }).type ||
      tabs.tab1.value;
    return (
      <div>
        <Tabs
          value={type}
          onChange={this.tabChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label={tabs.tab1.label} value={tabs.tab1.value} />
          <Tab label={tabs.tab2.label} value={tabs.tab2.value} />
          <Tab label={tabs.tab3.label} value={tabs.tab3.value} />
        </Tabs>
        <div style={{ marginTop: '2rem' }}>
          {type === tabs.tab1.value && <tabs.tab1.component />}
          {type === tabs.tab2.value && <tabs.tab2.component />}
          {type === tabs.tab3.value && 33333333333333333333333}
          {type === tabs.tab4.value && 33333333333333333333333}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Info);
