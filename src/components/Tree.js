import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SortableTree from 'react-sortable-tree';
import { withStyles } from '@material-ui/core';
import { Typography, IconButton } from '@material-ui/core';
import Autorenew from '@material-ui/icons/Autorenew';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import 'react-sortable-tree/style.css';
import '../assets/css/adminDeptTree.css'; // 自定义的一些样式

const style = {
  refreshBtn: { width: '2.5rem', height: '2.5rem' },
  refreshIcon: { fontSize: '2rem' },
  root: { display: 'flex', flexDirection: 'column', height: '100%' },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tree: { flex: '1', display: 'flex', flexDirection: 'column' },
  hideHead: { display: 'none' },
  hideRefresh: { display: 'none' },
  hideExpandCollapse: { display: 'none' }
};
class Tree extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeNodeSelectedId: '',
      treeNodeSelectedTitle: ''
    };
  }

  handleRefreshClick = e => {
    e.stopPropagation();
    this.props.onRefreshData();
  };

  /**
   * 点击控件空白处触发的事件，用户撤销选中节点
   */
  rootDivClickHandle = () => {
    this.state.treeNodeSelectedId && this.handleUnSelected();
  };

  /**
   * tree的node 文本被点击后调用的方法，传入node的id title属性
   * 触发上层组件的选中和撤销选中方法
   */
  handleSelected = (id, title) => {
    // 选中节点，并激活上级组件事件
    console.log('tree selected');
    this.props.onTreeNodeSelected && this.props.onTreeNodeSelected(id, title);
    this.setState({
      treeNodeSelectedId: id,
      treeNodeSelectedTitle: title
    });
  };
  handleUnSelected = () => {
    // 取消选中节点 ，并激活上级组件事件
    console.log('tree unselected');
    this.props.onTreeNodeUnSelected && this.props.onTreeNodeUnSelected();
    this.setState({
      treeNodeSelectedId: '',
      treeNodeSelectedTitle: ''
    });
  };

  handleExpandAllClick = e => {
    this.toogleExpandAll(e, true);
  };
  handleCollapseAllClick = e => {
    this.toogleExpandAll(e, false);
  };
  /**
   * 全部展开和全部折叠事件处理函数
   * @param {Event} e event
   * @param {boolean} expand 全部展开还是折叠
   */
  toogleExpandAll = (e, expand) => {
    e.stopPropagation();
    this.props.onExpandCollapseAll(expand);
  };

  generateNodeProps = ({ node }) => {
    return {
      style: {
        boxShadow:
          node.id === this.state.treeNodeSelectedId ? '0 0 0 2px blue' : ''
      },
      onClick: e => {
        // console.log(node, path, e.target.className, e);
        e.stopPropagation();
        if (
          e.target.className === 'rst__collapseButton' ||
          e.target.className === 'rst__expandButton' ||
          e.target.className === 'rst__moveHandle'
        ) {
          return; // 略过点击折叠按钮/移动手柄 触发选择事件
        }
        if (node.id === this.state.treeNodeSelectedId) {
          // 点击的节点id等于已经选中的id，触发取消选中事件
          this.handleUnSelected && this.handleUnSelected();
        } else {
          // 触发选中事件
          this.handleSelected && this.handleSelected(node.id, node.title);
        }
      }
    };
  };

  render() {
    const {
      classes,
      hideHead,
      hideRefresh,
      hideExpandCollapse,
      treeData,
      onChange,
      onVisibilityToggle,
      onMoveNode,
      title,
      ...rest
    } = this.props;
    console.log('tree render');
    return (
      <div className={classes.root} onClick={this.rootDivClickHandle}>
        <div
          className={classnames(classes.head, { [classes.hideHead]: hideHead })}
        >
          <Typography variant="title" align="center">
            {title}
          </Typography>
          <IconButton
            title="刷新"
            className={classnames(classes.refreshBtn, {
              [classes.hideRefresh]: hideRefresh
            })}
            onClick={this.handleRefreshClick}
          >
            <Autorenew className={classes.refreshIcon} />
          </IconButton>
          <IconButton
            title="全部折叠"
            className={classnames(classes.refreshBtn, {
              [classes.hideExpandCollapse]: hideExpandCollapse
            })}
            onClick={this.handleCollapseAllClick}
          >
            <ExpandLess className={classes.refreshIcon} />
          </IconButton>
          <IconButton
            title="全部展开"
            className={classnames(classes.refreshBtn, {
              [classes.hideExpandCollapse]: hideExpandCollapse
            })}
            onClick={this.handleExpandAllClick}
          >
            <ExpandMore className={classes.refreshIcon} />
          </IconButton>
        </div>
        <div className={classes.tree}>
          <SortableTree
            {...rest}
            treeData={treeData}
            rowHeight={50}
            onChange={onChange}
            onVisibilityToggle={onVisibilityToggle}
            onMoveNode={onMoveNode}
            getNodeKey={({ node }) => node.id}
            generateNodeProps={this.generateNodeProps}
          />
        </div>
      </div>
    );
  }
}

Tree.propTypes = {
  title: PropTypes.string, // 标题
  treeData: PropTypes.array.isRequired, // 控件树形数据
  onTreeNodeSelected: PropTypes.func, // 选中节点，并激活上级组件事件
  onTreeNodeUnSelected: PropTypes.func, // 取消选中节点，并激活上级组件事件
  onRefreshData: PropTypes.func, // 刷新按钮事件
  onChange: PropTypes.func.isRequired,
  onVisibilityToggle: PropTypes.func,
  onExpandCollapseAll: PropTypes.func,
  onMoveNode: PropTypes.func,
  hideHead: PropTypes.bool,
  hideRefresh: PropTypes.bool,
  hideExpandCollapse: PropTypes.bool
};

Tree.defaultProps = {
  hideHead: false,
  hideRefresh: false,
  hideExpandCollapse: false
};

export default withStyles(style)(Tree);
