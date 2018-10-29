import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  withStyles,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core';
import axios from 'axios';
import compose from 'recompose/compose';
import { reset, initialize } from 'redux-form';
import { actions as commonActions } from '../../reducers/common';
import {
  getDeptArray,
  makeDeptTree,
  getLevel1ExpandsfromTreeArray
} from '../../services/utility';
import Tree from '../../components/Tree';
import DeptForm from '../../forms/admin/DeptForm';
// import DeptForm from '../../forms/admin/DeptForm';

const style = () => ({
  root: {
    display: 'flex'
  },
  leftDept: {
    backgroundColor: '#aaa'
  },
  rightDept: {
    backgroundColor: '#888',
    flex: 'auto'
  },
  modeLink: {
    marginLeft: '2rem',
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' }
  }
});

class Dept extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeDataList: [], // 按照level和order排序的节点数组，非树形数据
      treeDataDic: null, // {id:node,id2:node2,...} 用于选择node时获取节点和父节点信息
      treeData: [],
      treeNodeSelected: {
        id: '',
        title: '',
        symbol: '',
        intro: '',
        parentName: '',
        parentId: ''
      },
      mode: 'viewEdit', // viewEdit 或者 add，浏览编辑模式或者添加模式
      confirmDeleteDialogOpen: false,
      deleteDeptIdList: [],
      dialogContent: ''
    };
    this.expands = {};
    this.deptTreeRef = React.createRef();
  }

  componentDidMount() {
    this.refreshDeptTreeData(true);
  }

  handleTreeDataChange = treeData => {
    this.setState({ treeData: treeData });
  };

  /**
   * 根据state中的dept list和expands计算出树形数据，只有本地计算
   */
  makeDeptTreeData = () => {
    const result = makeDeptTree(this.state.treeDataList, this.expands);
    this.setState({ treeData: result });
  };

  /**
   * 从后台重新获取dept数据，并计算出树形数据
   * @param {boolean} isMount 是否第一次加载，用来将level1设置为展开
   */
  refreshDeptTreeData = (isMount = false) => {
    getDeptArray().then(res => {
      if (res.success) {
        // 将原始队列数据保存在本地，以便之后计算
        if (isMount) {
          this.expands = getLevel1ExpandsfromTreeArray(res.data);
        }
        const result = makeDeptTree(res.data, this.expands);
        this.setState({
          treeDataList: res.data,
          treeData: result,
          treeDataDic: null
        });
      }
    });
  };

  handleConfirmDeleteDialogClose = () => {
    this.setState({ confirmDeleteDialogOpen: false, deleteDeptIdList: [] });
  };

  handleConfirmDeleteDialogOk = () => {
    axios
      .post('/dept/delete', { idList: this.state.deleteDeptIdList })
      .then(res => {
        if (res.success) {
          const tryToDelNum = this.state.deleteDeptIdList.length;
          if (res.data !== tryToDelNum) {
            this.props.dispatch(
              commonActions.showMessage(
                `尝试删除${tryToDelNum}个，实际删除${res.data}个`,
                'warn'
              )
            );
          }
          this.refreshDeptTreeData();
        }
        this.handleConfirmDeleteDialogClose();
      });
  };

  handleDelDept = () => {
    const id = this.state.treeNodeSelected.id;
    if (!id) return;
    axios.get(`/dept/${id}?withOffspring=1`).then(res => {
      if (res.success) {
        const depts = res.data;
        if (depts.length === 0) return;
        if (depts.length >= 1) {
          this.setState({
            deleteDeptIdList: depts.map(v => v.id),
            confirmDeleteDialogOpen: true,
            dialogContent: `${depts.map(v => v.name).join(',')}`
          });
        }
      }
    });
  };

  handleVisibilityToggle = ({ node: { id: nodeId }, expanded }) => {
    typeof this.expands === 'boolean'
      ? (this.expands = { [nodeId]: expanded })
      : (this.expands = { ...this.expands, [nodeId]: expanded });
  };

  handleExpandCollapseAll = expand => {
    if (this.expands === expand) return;
    this.expands = expand;
    const result = makeDeptTree(this.state.treeDataList, this.expands);
    this.setState({ treeData: result });
  };

  /**
   * 根据state.treeDataDic获取选中节点信息和父节点信息。
   * treeDataDic若为空，从treeDataList计算得出
   */
  handleTreeNodeSelected = id => {
    let node = null;
    let parentName = '';
    if (!this.state.treeDataDic) {
      console.log('treeDataDic为空，重新计算');
      let treeDataDic = {};
      this.state.treeDataList.forEach(node => {
        treeDataDic[node.id] = node;
      });
      node = treeDataDic[id];
      parentName =
        node.parent_id === '0' ? '' : treeDataDic[node.parent_id].name;
      this.setState({ treeDataDic });
    } else {
      node = this.state.treeDataDic[id];
      parentName =
        node.parent_id === '0'
          ? ''
          : this.state.treeDataDic[node.parent_id].name;
    }
    this.setState({
      treeNodeSelected: {
        id: node.id,
        title: node.name,
        symbol: node.symbol,
        intro: node.intro,
        parentId: node.parent_id,
        parentName
      }
    });
  };

  handleTreeNodeUnSelected = () => {
    this.setState({
      treeNodeSelected: {}
    });
  };

  compareTreePath = (a1, a2) => {
    if (a1.length !== a2.length) return false;
    for (let i = 0; i < a1.length; i++) {
      if (a1[i] !== a2[i]) {
        return false;
      }
    }
    return true;
  };

  handleTreeNodeMove = ({
    nextParentNode,
    node,
    treeData,
    prevPath,
    nextPath,
    prevTreeIndex,
    nextTreeIndex
  }) => {
    console.log('node ' + JSON.stringify(node));
    console.log('nextParentNode ' + JSON.stringify(nextParentNode));

    if (
      prevTreeIndex === nextTreeIndex &&
      this.compareTreePath(prevPath, nextPath)
    ) {
      console.log('没有变化');
      return;
    }
    let parentId, compeer;
    if (nextParentNode) {
      // 移动到非根节点
      parentId = nextParentNode.id;
      compeer = nextParentNode.children
        ? nextParentNode.children.map(node => node.id)
        : [];
    } else {
      // 移动到根节点
      parentId = '0';
      compeer = treeData.map(node => node.id);
    }
    axios
      .post('/dept/move', {
        id: node.id,
        parentId: parentId,
        compeer: compeer
      })
      .then(() => {
        console.log('dept move success');
      });
  };

  changeMode = () => {
    this.setState({ mode: this.state.mode === 'add' ? 'viewEdit' : 'add' });
  };
  handleSubmit = values => {
    if (this.state.mode === 'add') {
      const parentId = this.state.treeNodeSelected.id || '0';
      axios
        .post('/dept/add', {
          name: values.name,
          symbol: values.symbol,
          intro: values.intro,
          parentId: parentId
        })
        .then(res => {
          console.log('add dept res');
          if (res.success) {
            console.log('add dept succ');
            this.refreshDeptTreeData();
            this.props.dispatch(reset('addDeptForm'));
          }
          console.log('add dept res end ', res.success);
        });
    } else {
      axios
        .post('/dept/update', {
          name: values.name,
          intro: values.intro,
          id: this.state.treeNodeSelected.id
        })
        .then(res => {
          if (res.success) {
            this.refreshDeptTreeData();
            this.props.dispatch(initialize('editDeptForm', values));
          }
        });
    }
  };
  render() {
    console.log('dept render');
    const { classes } = this.props;
    const {
      treeNodeSelected: { title, symbol, intro, parentName },
      mode,
      treeData,
      dialogContent,
      confirmDeleteDialogOpen
    } = this.state;
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} sm={5}>
          <Tree
            title="部门架构"
            treeData={treeData}
            onChange={this.handleTreeDataChange}
            onVisibilityToggle={this.handleVisibilityToggle}
            onExpandCollapseAll={this.handleExpandCollapseAll}
            onRefreshData={this.refreshDeptTreeData}
            onTreeNodeSelected={this.handleTreeNodeSelected}
            onTreeNodeUnSelected={this.handleTreeNodeUnSelected}
            onMoveNode={this.handleTreeNodeMove}
          />
        </Grid>
        <Grid item xs={12} sm container spacing={24} direction="column">
          <Grid item container justify="center" alignItems="flex-end">
            <Typography variant="title">
              {mode === 'add' ? '添加节点' : '查看编辑节点'}
            </Typography>
            <Typography
              className={classes.modeLink}
              variant="button"
              onClick={this.changeMode}
            >
              {mode === 'add' ? '查看编辑节点' : '添加节点'}
            </Typography>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <DeptForm
            key={mode}
            form={mode === 'add' ? 'addDeptForm' : 'editDeptForm'}
            onDelete={this.handleDelDept}
            enableReinitialize
            keepDirtyOnReinitialize
            initialValues={
              mode === 'add'
                ? {
                    parent: title ? title : '作为根节点'
                  }
                : {
                    name: title,
                    symbol: symbol,
                    intro: intro,
                    parent: parentName || '根节点'
                  }
            }
            mode={mode}
            onSubmit={this.handleSubmit}
          />
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <ul>
              <Typography>Tips:</Typography>
              <li>
                <Typography>编辑模式下，选中节点进行编辑</Typography>
              </li>
              <li>
                <Typography>
                  添加模式下，若不选中节点，则添加节点设置为根节点
                </Typography>
              </li>
              <li>
                <Typography>节点排序请拖动左侧节点手柄</Typography>
              </li>
            </ul>
          </Grid>
        </Grid>
        <Dialog open={confirmDeleteDialogOpen} disableBackdropClick>
          <DialogTitle>是否确认删除</DialogTitle>
          <DialogContent>
            <Typography>
              本次删除的部门节点包括（
              <strong>{dialogContent}</strong>
              ）,请确保所有节点下没有用户等其他关联内容！
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleConfirmDeleteDialogOk}
            >
              确认
            </Button>
            <Button
              variant="text"
              onClick={this.handleConfirmDeleteDialogClose}
            >
              取消
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

function mapStateToProps() {
  return {};
}
export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(Dept);
