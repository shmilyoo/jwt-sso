import React from 'react';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import history from '../../history';
import qs from 'qs';
import { actions as commonActions } from '../../reducers/common';
import InfoBasic from './InfoBasic';
import InfoEducation from './InfoEducation';

// const [tab1, tab2, tab3, tab4] = ['basic', 'education', 'work', 'family'];
const tabs = [
  { label: '基本资料', value: 'basic', component: InfoBasic },
  { label: '教育经历', value: 'education', component: InfoEducation },
  { label: '工作经历', value: 'work', component: InfoEducation },
  { label: '家庭关系', value: 'family', component: InfoEducation }
];

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
      tabs[0].value;
    return (
      <div>
        <Tabs
          value={type}
          onChange={this.tabChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          {tabs.map(tab => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
        <div style={{ marginTop: '2rem' }}>
          {tabs.map(
            tab => type === tab.value && <tab.component key={tab.value} />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Info);
