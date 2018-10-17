import React from 'react';
import PropTypes from 'prop-types';
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
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons';
import history from '../history';
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
    fontSize: '1.5rem',
    paddingLeft: '10px'
  },
  selected: {
    backgroundColor: '#333'
  }
};

class LeftNav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 由于普通用户界面和管理员界面的url层次不同，/account/info, /admin/organ/dept
      // 为便于初始打开页面时左侧导航栏根据path自动展开，需要在mount的时候分析path
      [props.location.pathname.split('/')[props.type === 'admin' ? 2 : 1]]: true
    };
  }

  drawItemClick = url => () => {
    // this.props.dispatch({ type: commonTypes.CHANGE_TITLE, title }); 在各自页面中设置title
    // console.log(this.props.location.pathname, url);
    if (this.props.location.pathname === url) {
      return;
    }
    history.push(url);
  };

  render() {
    const { classes, open, location, header, menu } = this.props;
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
            variant="h6"
          >
            {header}
          </Typography>
          <Divider style={{ margin: '0 20px' }} />
          <List component="nav">
            {menu.map(ele => (
              <div key={ele.title}>
                <ListItem
                  button
                  className={classnames({
                    [classes.selected]: ele.path === location.pathname
                  })} // 适用于没有子菜单的元素，也可以被选中
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
                  {ele.icon && <ListItemIcon>{<ele.icon />}</ListItemIcon>}
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

LeftNav.propTypes = {
  type: PropTypes.string, // 代表是被哪个页面调用
  menu: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  header: PropTypes.string.isRequired
};

export default compose(
  withRouter,
  withStyles(style)
)(LeftNav);
