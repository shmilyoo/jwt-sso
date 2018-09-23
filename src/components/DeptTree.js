import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Typography, IconButton, Grid } from '@material-ui/core';
import Autorenew from '@material-ui/icons/Autorenew';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Tree from './Tree';

const style = {
  root: { display: 'flex', flexDirection: 'column' }
};
class DeptTree extends React.PureComponent {
  componentDidMount() {
    this.refreshTreeData();
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container direction="column">
        <Grid item container justify="center" alignItems="center">
          <Typography variant="title" align="center">
            部门架构
          </Typography>
          <IconButton
            title="刷新"
            className={classes.refreshBtn}
            onClick={this.refreshTreeData}
          >
            <Autorenew className={classes.refreshIcon} />
          </IconButton>
          <IconButton
            title="全部折叠"
            className={classes.refreshBtn}
            onClick={() => {
              this.toogleExpandAll(false);
            }}
          >
            <ExpandLess className={classes.refreshIcon} />
          </IconButton>
          <IconButton
            title="全部展开"
            className={classes.refreshBtn}
            onClick={() => {
              this.toogleExpandAll(false);
            }}
          >
            <ExpandMore className={classes.refreshIcon} />
          </IconButton>
        </Grid>
        <Grid item xs>
          <Tree
            treeData={treeData}
            selected={treeNodeSelectedId}
            onSelected={this.treeNodeSelected}
            onChange={this.handleTreeChange}
            // onCollapse={this.treeCollapseChange}
          />
        </Grid>
      </Grid>
    );
  }
}

DeptTree.propTypes = {};

export default withStyles(style)(DeptTree);
