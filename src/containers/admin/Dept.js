import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  withStyles,
  Typography,
  TextField,
  Button,
  IconButton
} from '@material-ui/core';
import Autorenew from '@material-ui/icons/Autorenew';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import compose from 'recompose/compose';
import { actions as commonActions } from '../../reducers/common';
import Tree from '../../components/Tree';
import {
  createDept,
  getDeptArray,
  makeDeptTree,
  toogleExpandTreeData
} from '../../services/utility';

const style = theme => ({
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
  delBtn: {
    '&:hover': { backgroundColor: theme.palette.error.light }
  },
  refreshBtn: { width: '2.5rem', height: '2.5rem' },
  refreshIcon: { fontSize: '2rem' }
});

class Dept extends Component {
  constructor(props) {
    super(props);
    props.dispatch(commonActions.changeTitle('部门架构管理'));
    this.state = {
      addNodeText: '', // 添加节点的名称title
      treeNodeSelectedId: '',
      selectedDept: {}, // 显示在右侧表格中的选中部门信息，用于编辑删除等
      treeData: []
    };
    this.expand = {}; //记录tree的各个节点展开折叠信息
    console.log('dept constrcut');
  }

  componentDidMount() {
    // 获取部门结构，setstate
    this.refreshTreeData();
  }

  componentDidUpdate() {
    console.log('dept did update');
  }

  refreshTreeData = () => {
    console.log('refresh');
    getDeptArray().then(res => {
      console.log(res);
      if (res.success) {
        const treeData = makeDeptTree(res.data, this.expand);
        this.setState({ treeData });
      } else {
        this.props.dispatch(commonActions.showMessage(res.error, 'error'));
      }
    });
  };
  addNodeTextChange = e => {
    this.setState({ addNodeText: e.target.value.trim() });
    // this.props.dispatch(commonActions.showMessage(e.target.value));
  };
  addNodeTextClick = () => {
    // 添加根节点或者添加下级节点，如果添加下级节点，必须先选中一个父节点
    const { addNodeText, treeData, treeNodeSelectedId } = this.state;
    let response = null;
    let intro = 'intro';
    let parent = treeNodeSelectedId;
    if (treeData && treeData.length > 0) {
      if (!treeNodeSelectedId) {
        this.props.dispatch(
          commonActions.showMessage('必须选择一个父节点', 'warn')
        );
        return;
      }
    } else {
      parent = '0';
    }
    createDept(addNodeText, intro, parent).then(res => {
      res.success
        ? this.refreshTreeData()
        : this.props.dispatch(
            commonActions.showMessage(response.error, 'error')
          );
      this.setState({ addNodeText: '' });
    });
  };
  /**
   * tree的onChange方法，必须
   */
  handleTreeChange = treeData => this.setState({ treeData });
  /**
   * tree的node 文本被选中后调用的方法，传入node的id属性
   */
  treeNodeSelected = id =>
    this.setState({
      treeNodeSelectedId: id === this.state.treeNodeSelectedId ? '' : id
    });
  treeCollapseChange = (nodeId, expanded) => {
    this.expand.nodeId = expanded;
  };
  toogleExpandAll = expand => {
    if (expand === this.expand) return;
    this.expand = expand;
    this.setState({ treeData: toogleExpandTreeData(this.state.treeData) });
  };
  render() {
    const { classes } = this.props;
    const {
      treeData,
      addNodeText,
      treeNodeSelectedId,
      selectedDept
    } = this.state;
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} sm={5}>
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
        </Grid>
        <Grid item xs={12} sm container spacing={24} direction="column">
          <Grid item container spacing={24} alignItems="flex-end">
            <Grid item>
              <TextField
                label={
                  treeData && treeData.length > 0 ? '添加节点' : '添加根节点'
                }
                value={this.state.addNodeText}
                onChange={this.addNodeTextChange}
              />
            </Grid>
            <Grid item>
              <Button
                variant="raised"
                size="medium"
                color="secondary"
                disabled={!addNodeText}
                onClick={this.addNodeTextClick}
              >
                添加
              </Button>
            </Grid>
          </Grid>
          {treeNodeSelectedId && (
            <React.Fragment>
              <Grid item container spacing={16}>
                <Grid item xs>
                  <TextField label="部门名称" fullWidth />
                </Grid>
                <Grid item xs>
                  <TextField label="部门名称2" fullWidth />
                </Grid>
              </Grid>
              <Grid item container spacing={16} justify="center">
                <Grid item>
                  <Button
                    variant="raised"
                    size="medium"
                    color="secondary"
                    onClick={this.addNodeTextClick}
                  >
                    更新
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.delBtn}
                    variant="raised"
                    size="medium"
                    onClick={this.addNodeTextClick}
                  >
                    删除
                  </Button>
                </Grid>
              </Grid>
              <Grid item>222</Grid>
              <Grid item>333</Grid>
              <Grid item>111</Grid>
            </React.Fragment>
          )}
          <Grid item>333</Grid>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {};
}
export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(Dept);
