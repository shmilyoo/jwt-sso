import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import LeftNav from '../../components/LeftNav';
import { adminLeftMenu } from '../../config';
import Dept from './Dept';
import Sso from './Sso';
import AppHead from '../AppHead';

const drawerWidth = 250;

const style = () => ({
  homeRoot: {
    height: '100%',
    width: '100%'
  },
  right: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    height: '100%'
  },
  rightShift: {
    width: '100%',
    marginLeft: 0
  },
  main: {
    padding: 24,
    flex: 'auto',
    display: 'flex',
    overflowX: 'hidden'
  },
  white: {
    color: 'white'
  }
});

const AdminRoot = ({ classes }) => {
  console.log('render admin root');
  return (
    <div className={classes.homeRoot}>
      <LeftNav
        type="admin"
        menu={adminLeftMenu}
        open={true}
        header="后台管理"
      />
      <div className={classes.right}>
        <AppHead type="admin" />
        <div className={classes.main}>
          <Switch>
            <Route path="/admin/organ/dept" component={Dept} />
            <Route path="/admin/interface/sso" component={Sso} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default withStyles(style)(AdminRoot);
