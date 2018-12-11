import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import history from '../../../history';
import InfoBasic from './InfoBasic';
import InfoWorkExp from './InfoWorkExp';
import InfoEduExp from './InfoEduExp';

class Info extends React.PureComponent {
  tabChange = (_event, value) => {
    history.push(`/account/info/${value}`);
  };
  render() {
    const {
      match,
      location: { pathname }
    } = this.props;
    let type = pathname.substring(match.path.length + 1);
    let TabContent = null;
    if (type === 'work') TabContent = InfoWorkExp;
    else if (type === 'edu') TabContent = InfoEduExp;
    else if (type === 'family') TabContent = null;
    else {
      type = 'basic';
      TabContent = InfoBasic;
    }
    console.log(type);
    return (
      <div>
        <Tabs
          value={type}
          onChange={this.tabChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab key="basic" label="基本资料" value="basic" />
          <Tab key="edu" label="教育经历" value="edu" />
          <Tab key="work" label="工作经历" value="work" />
          <Tab key="family" label="家庭关系" value="family" />
        </Tabs>
        <div style={{ marginTop: '2rem' }}>
          <TabContent />
        </div>
      </div>
    );
  }
}

export default Info;
