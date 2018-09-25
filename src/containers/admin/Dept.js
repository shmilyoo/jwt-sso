import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  withStyles,
  TextField,
  Button,
  Divider
} from '@material-ui/core';
import compose from 'recompose/compose';
import { actions as commonActions } from '../../reducers/common';
import { addDept } from '../../services/utility';
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
      addNodeName: '', // 添加节点的名称title
      addNodeSymbol: '', // 添加节点的简称符号
      addNodeIntro: '', // 添加节点的介绍
      selectedDept: {}, // 显示在右侧表格中的选中部门信息，用于编辑删除等
      test: { name: '' }
    };
    this.deptTreeRef = React.createRef();
    console.log('dept constrcut 222');
  }

  componentDidUpdate() {
    console.log('dept did update');
  }

  addNodeChange = (e, attr) => {
    this.setState({ [attr]: e.target.value.trim() });
  };
  addNodeTextClick = () => {
    // 添加根节点或者添加下级节点，如果添加下级节点，必须先选中一个父节点
    const { addNodeName, treeNodeSelectedId } = this.state;
    let response = null;
    let intro = 'intro';
    let parent = treeNodeSelectedId ? treeNodeSelectedId : '0';
    addDept(addNodeName, intro, parent).then(res => {
      console.log(this.deptTreeRef);
      res.success
        ? this.deptTreeRef.current.refreshTreeData()
        : this.props.dispatch(commonActions.showMessage(res.error, 'error'));
      this.setState({ addNodeText: '' });
    });
  };
  deptTreeNodeSelected = id => {
    this.setState({
      treeNodeSelectedId: id === this.state.treeNodeSelectedId ? '' : id
    });
  };
  render() {
    console.log('dept render');
    const { classes } = this.props;
    const {
      addNodeName,
      addNodeSymbol,
      addNodeIntro,
      treeNodeSelectedId,
      selectedDept
    } = this.state;
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} sm={5}>
          <DeptTree
            innerRef={this.deptTreeRef}
            deptTreeNodeSelected={this.deptTreeNodeSelected}
          />
        </Grid>
        <Grid item xs={12} sm container spacing={24} direction="column">
          <Grid item container spacing={16} alignItems="flex-end">
            <Grid item xs>
              <TextField
                label={treeNodeSelectedId ? '节点名称' : '根节点名称'}
                title="节点的名称，最多32个字符"
                value={addNodeName}
                onChange={e => {
                  this.addNodeChange(e, 'addNodeName');
                }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                label={treeNodeSelectedId ? '子节点代号' : '根节点代号'}
                title="节点的字母缩写，最多16个字符"
                value={addNodeSymbol}
                onChange={e => {
                  this.addNodeChange(e, 'addNodeSymbol');
                }}
                // onBlur
              />
            </Grid>
            <Grid item xs>
              <TextField
                multiline
                label={treeNodeSelectedId ? '子节点介绍' : '根节点介绍'}
                title="节点的介绍，最多64个字符"
                value={addNodeIntro}
                onChange={e => {
                  this.addNodeChange(e, 'addNodeIntro');
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="raised"
                size="medium"
                color="secondary"
                disabled={!(addNodeName && addNodeSymbol)}
                onClick={this.addNodeTextClick}
              >
                添加
              </Button>
            </Grid>
          </Grid>
          <Divider />
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
                    // onClick={this}
                  >
                    更新
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.delBtn}
                    variant="raised"
                    size="medium"
                    // onClick={this}
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
