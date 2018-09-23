import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Typography, IconButton, Grid } from '@material-ui/core';
import Autorenew from '@material-ui/icons/Autorenew';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Tree from './Tree';
import {
  makeDeptTree,
  getDeptArray,
  toogleExpandTreeData
} from '../services/utility';
import { actions as commonActions } from '../reducers/common';
import compose from 'recompose/compose';

const style = {
  refreshBtn: { width: '2.5rem', height: '2.5rem' },
  refreshIcon: { fontSize: '2rem' },
  root: { display: 'flex', flexDirection: 'column', height: '100%' },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tree: { flex: '1', display: 'flex', flexDirection: 'column' }
};
class DeptTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeNodeSelectedId: '',
      treeData: []
    };
    this.expands = {}; //记录tree的各个节点展开折叠信息
    console.log('deptTree constrcut');
  }
  componentDidMount() {
    // 获取部门结构，setstate
    this.refreshTreeData();
  }

  componentDidUpdate() {
    console.log('dept tree did update');
  }

  refreshTreeData = () => {
    console.log('dept tree refresh data');
    getDeptArray().then(res => {
      if (res.success) {
        console.log(this.expands);
        const result = makeDeptTree(res.data, this.expands);
        this.setState({ treeData: result[0] });
        if (result[1]) this.expands = result[1];
      } else {
        this.props.dispatch(commonActions.showMessage(res.error, 'error'));
      }
    });
  };
  refreshBtnHandle = e => {
    e.stopPropagation();
    this.refreshTreeData();
  };

  rootDivClickHandle = () => {
    this.state.treeNodeSelectedId &&
      this.treeNodeSelected(this.state.treeNodeSelectedId);
  };

  /**
   * tree的onChange方法，必须
   */
  handleTreeChange = treeData => this.setState({ treeData });

  /**
   * tree的node 文本被选中后调用的方法，传入node的id属性
   */
  treeNodeSelected = id => {
    this.props.deptTreeNodeSelected && this.props.deptTreeNodeSelected(id);
    this.setState({
      treeNodeSelectedId: id === this.state.treeNodeSelectedId ? '' : id
    });
  };

  treeCollapseChange = (nodeId, expanded) => {
    console.log(nodeId, expanded);
    typeof this.expands === 'boolean'
      ? (this.expands = { [nodeId]: expanded })
      : (this.expands[nodeId] = expanded);
  };

  toogleExpandAll = (e, expand) => {
    e.stopPropagation();
    if (expand === this.expands) return;
    this.expands = expand;
    this.setState({
      treeData: toogleExpandTreeData(this.state.treeData, expand)
    });
  };

  render() {
    const { classes } = this.props;
    const { treeNodeSelectedId, treeData } = this.state;
    return (
      <div className={classes.root} onClick={this.rootDivClickHandle}>
        <div className={classes.head}>
          <Typography variant="title" align="center">
            部门架构
          </Typography>
          <IconButton
            title="刷新"
            className={classes.refreshBtn}
            onClick={this.refreshBtnHandle}
          >
            <Autorenew className={classes.refreshIcon} />
          </IconButton>
          <IconButton
            title="全部折叠"
            className={classes.refreshBtn}
            onClick={e => {
              this.toogleExpandAll(e, false);
            }}
          >
            <ExpandLess className={classes.refreshIcon} />
          </IconButton>
          <IconButton
            title="全部展开"
            className={classes.refreshBtn}
            onClick={e => {
              this.toogleExpandAll(e, true);
            }}
          >
            <ExpandMore className={classes.refreshIcon} />
          </IconButton>
        </div>
        <div className={classes.tree}>
          <Tree
            treeData={treeData}
            selected={treeNodeSelectedId}
            onSelected={this.treeNodeSelected}
            onChange={this.handleTreeChange}
            onCollapse={this.treeCollapseChange}
          />
        </div>
      </div>
    );
  }
}

DeptTree.propTypes = {};

// export default compose(withStyles(style))(DeptTree);

export default withStyles(style)(DeptTree);
