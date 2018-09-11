import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import {
  withStyles,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Person as UserIcon,
  PowerSettingsNew as LogoutIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons';
import { leftMenu, sysName } from '../config';
import history from '../history';
import { types as commonTypes } from '../reducers/common';
import classnames from 'classnames';

const drawerWidth = 250;

const style = {
  left: {
    // height: "100%",
    width: drawerWidth
  },
  leftPage: {
    width: drawerWidth,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 0 // pager原本zindex为1200， NProgress会被遮住
  },
  leftHeader: {
    height: '64px',
    lineHeight: '64px',
    color: '#FFF'
  },
  link: {
    color: '#FFF',
    opacity: 0.8,
    fontWeight: 'bold',
    fontSize: '1.8rem'
  },
  link2: {
    fontSize: '1.5rem'
  },
  selected: {
    backgroundColor: '#333'
  }
};

class HomeLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      [props.location.pathname.split('/')[1]]: true
    };
  }

  state = {};
  drawItemClick = url => () => {
    // this.props.dispatch({ type: commonTypes.CHANGE_TITLE, title }); 在各自页面中设置title
    history.push(url);
  };
  render() {
    const { classes, open, location } = this.props;
    console.log('home left render');
    return (
      <div className={classes.left}>
        <Drawer
          classes={{ paper: classes.leftPage }}
          variant="persistent"
          open={open}
        >
          <Typography
            className={classes.leftHeader}
            component="div"
            align="center"
            variant="title"
          >
            {sysName}
          </Typography>
          <Divider />
          <List component="nav">
            {leftMenu.map(ele => (
              <div key={ele.title}>
                <ListItem
                  button
                  className={classnames({
                    [classes.selected]: ele.path === location.pathname
                  })}
                  onClick={
                    ele.children
                      ? () => {
                          this.setState({
                            [ele.state]: !this.state[ele.state]
                          });
                        }
                      : this.drawItemClick(ele.path, ele.title)
                  }
                >
                  <ListItemIcon>{<ele.icon />}</ListItemIcon>
                  <ListItemText
                    inset
                    primary={ele.title}
                    primaryTypographyProps={{ className: classes.link }}
                  />
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
                    <List component="nav" disablePadding>
                      {ele.children.map(child => (
                        <ListItem
                          key={child.title}
                          className={classnames({
                            [classes.selected]: child.path === location.pathname
                          })}
                          button
                          onClick={this.drawItemClick(child.path, child.title)}
                        >
                          <ListItemText
                            inset
                            primary={child.title}
                            primaryTypographyProps={{
                              className: classnames(classes.link, classes.link2)
                            }}
                          />
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
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default compose(
  withStyles(style),
  withRouter,
  connect(mapStateToProps)
)(HomeLeft);
