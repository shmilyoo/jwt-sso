import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Route } from 'react-router-dom';
import compose from 'recompose/compose';
import classNames from 'classnames';
import { types as accountTypes } from '../reducers/account';
import {
  withStyles,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  Button,
  IconButton,
  Tooltip,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  CircularProgress
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Person as UserIcon,
  PowerSettingsNew as LogoutIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons';
import { leftMenu } from '../config';
import history from '../history';

const drawerWidth = 200;

const style = theme => ({
  homeRoot: {
    height: '100%',
    width: '100%'
  },
  left: {
    height: '100%',
    width: drawerWidth
  },
  leftPage: {
    width: drawerWidth,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 0 // pager原本zindex为1200， NProgress会被遮住
  },
  leftHeader: {
    height: 64
  },
  right: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    height: '100%',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  rightShift: {
    width: '100%',
    marginLeft: 0
  },
  main: {
    padding: 20,
    flex: 'auto'
  },
  footer: {
    padding: 10,
    textAlign: 'right'
  },
  white: {
    color: 'white'
  }
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log('home construct');
  }

  state = {
    open: true
  };
  logout = () => {
    this.props.dispatch({ type: accountTypes.SAGA_LOGOUT_REQUEST });
  };
  drawItemClick = url => () => {
    history.push(url);
  };
  componentWillMount() {
    this.setState({ account: true });
  }
  render() {
    console.log('render home');
    const { classes } = this.props;
    return (
      <div className={classes.homeRoot}>
        <div className={classes.left}>
          <Drawer
            classes={{ paper: classes.leftPage }}
            variant="persistent"
            open={this.state.open}
          >
            <div className={classes.leftHeader}>left-header</div>
            <Divider />
            <List component="nav">
              {leftMenu.map(ele => (
                <div key={ele.title}>
                  <ListItem
                    button
                    onClick={
                      ele.children
                        ? () => {
                            this.setState({
                              [ele.state]: !this.state[ele.state]
                            });
                          }
                        : this.drawItemClick(ele.path)
                    }
                  >
                    <ListItemIcon>
                      <MenuIcon />
                    </ListItemIcon>
                    <ListItemText inset primary={ele.title} />
                    {ele.children ? (
                      this.state[ele.state] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )
                    ) : null}
                  </ListItem>
                  {ele.children ? (
                    <Collapse
                      in={this.state[ele.state] ? true : false}
                      timeout="auto"
                    >
                      <List component="div" disablePadding>
                        {ele.children.map(child => (
                          <ListItem
                            key={child.title}
                            button
                            onClick={this.drawItemClick(child.path)}
                          >
                            <ListItemText inset primary={child.title} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  ) : null}
                </div>
              ))}
            </List>
          </Drawer>
        </div>
        <div
          className={classNames(classes.right, {
            [classes.rightShift]: !this.state.open
          })}
        >
          <div className={classes.header}>
            <AppBar color="secondary" position="static">
              <Toolbar style={{ display: 'flex' }}>
                <IconButton
                  onClick={() => {
                    this.setState({ open: !this.state.open });
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography style={{ flex: 'auto' }} variant="title">
                  Photos
                </Typography>
                <IconButton>
                  <UserIcon />
                </IconButton>
                <Tooltip title="注销">
                  <IconButton onClick={this.logout}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </AppBar>
          </div>
          <div className={classes.main}>
            <Route />
          </div>
          <div className={classes.footer}>@copyright 2018</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.account.username
  };
}

export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(Home);
