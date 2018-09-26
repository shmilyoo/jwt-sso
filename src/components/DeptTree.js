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
  toggleExpandTreeData
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
class DeptTree extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeNodeSelectedId: '',
      treeNodeSelectedTitle: '',
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
        const result = makeDeptTree(res.data, this.expands);
        this.setState({ treeData: result[0] });
        if (result[1]) this.expands = result[1];
      } else {
        // this.props.dispatch(commonActions.showMessage(res.error, 'error'));
        console.log(`error is ${res.error}`);
      }
    });
  };
  refreshBtnHandle = e => {
    e.stopPropagation();
    this.refreshTreeData();
  };

  /**
   * 点击控件空白处触发的事件，用户撤销选中节点
   */
  rootDivClickHandle = () => {
    this.state.treeNodeSelectedId && this.treeNodeUnSelected();
  };

  /**
   * tree的onChange方法，必须
   */
  handleTreeChange = treeData => this.setState({ treeData });

  /**
   * tree的node 文本被点击后调用的方法，传入node的id title属性
   * 触发上层组件的选中和撤销选中方法
   */
  treeNodeSelected = (id, title) => {
    // 选中节点，并激活上级组件事件
    console.log('dept tree selected');
    this.props.deptTreeNodeSelected &&
      this.props.deptTreeNodeSelected(id, title);
    this.setState({
      treeNodeSelectedId: id,
      treeNodeSelectedTitle: title
    });
  };
  treeNodeUnSelected = () => {
    // 取消选中节点 ，并激活上级组件事件
    console.log('dept tree unselected');
    this.props.deptTreeNodeUnSelected && this.props.deptTreeNodeUnSelected();
    this.setState({
      treeNodeSelectedId: '',
      treeNodeSelectedTitle: ''
    });
  };

  treeCollapseChange = (nodeId, expanded) => {
    console.log(nodeId, expanded);
    typeof this.expands === 'boolean'
      ? (this.expands = { [nodeId]: expanded })
      : (this.expands[nodeId] = expanded);
  };

  expandAll = e => {
    this.toogleExpandAll(e, true);
  };
  collapseAll = e => {
    this.toogleExpandAll(e, false);
  };
  /**
   * 全部展开和全部折叠事件处理函数
   * @param {Event} e event
   * @param {boolean} expand 全部展开还是折叠
   */
  toogleExpandAll = (e, expand) => {
    e.stopPropagation();
    if (expand === this.expands) return;
    this.expands = expand;
    this.setState({
      treeData: toggleExpandTreeData(this.state.treeData, expand)
    });
    this.refreshTreeData();
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
            onClick={this.collapseAll}
          >
            <ExpandLess className={classes.refreshIcon} />
          </IconButton>
          <IconButton
            title="全部展开"
            className={classes.refreshBtn}
            onClick={this.expandAll}
          >
            <ExpandMore className={classes.refreshIcon} />
          </IconButton>
        </div>
        <div className={classes.tree}>
          <Tree
            treeData={treeData}
            selected={treeNodeSelectedId}
            onSelected={this.treeNodeSelected}
            onUnSelected={this.treeNodeUnSelected}
            onChange={this.handleTreeChange}
            onCollapse={this.treeCollapseChange}
          />
        </div>
      </div>
    );
  }
}

DeptTree.propTypes = {
  deptTreeNodeSelected: PropTypes.func,
  deptTreeNodeUnSelected: PropTypes.func
};

export default withStyles(style)(DeptTree);
