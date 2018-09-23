import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, withStyles, TextField, Button } from '@material-ui/core';
import compose from 'recompose/compose';
import { actions as commonActions } from '../../reducers/common';
import { createDept } from '../../services/utility';
import DeptTree from '../../components/DeptTree';

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
  }
});

class Dept extends Component {
  constructor(props) {
    super(props);
    props.dispatch(commonActions.changeTitle('部门架构管理'));
    this.state = {
      addNodeText: '', // 添加节点的名称title
      selectedDept: {} // 显示在右侧表格中的选中部门信息，用于编辑删除等
    };
    this.deptTreeRef = React.createRef();
    console.log('dept constrcut 222');
  }

  componentDidUpdate() {
    console.log('dept did update');
  }

  addNodeTextChange = e => {
    this.setState({ addNodeText: e.target.value.trim() });
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
        ? this.deptTreeRef.refreshTreeData()
        : this.props.dispatch(
            commonActions.showMessage(response.error, 'error')
          );
      this.setState({ addNodeText: '' });
    });
  };
  deptTreeNodeSelected = id => {
    this.setState({ treeNodeSelectedId: id });
  };
  render() {
    const { classes } = this.props;
    const { addNodeText, treeNodeSelectedId, selectedDept } = this.state;
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} sm={5}>
          <DeptTree
            ref={this.deptTreeRef}
            deptTreeNodeSelected={this.deptTreeNodeSelected}
          />
        </Grid>
        <Grid item xs={12} sm container spacing={24} direction="column">
          <Grid item container spacing={24} alignItems="flex-end">
            <Grid item>
              <TextField
                label={treeNodeSelectedId ? '添加子节点' : '添加根节点'}
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
