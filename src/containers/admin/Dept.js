import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  withStyles,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Card,
  CardContent,
  Paper
} from '@material-ui/core';
import compose from 'recompose/compose';
import { actions as commonActions } from '../../reducers/common';
import Tree from '../../components/Tree';

const style = {
  root: {
    display: 'flex'
  },
  leftDept: {
    backgroundColor: '#aaa'
  },
  rightDept: {
    backgroundColor: '#888',
    flex: 'auto'
  }
};

class Dept extends Component {
  constructor(props) {
    super(props);
    props.dispatch(commonActions.changeTitle('部门架构管理'));
    this.state = {
      addNodeText: '', // 添加节点的名称title
      treeNodeSelectedId: '',
      treeData: [
        {
          title: 'src/sfdfadsfsafsafdsfsfffffffffff',
          id: 'index1',
          expanded: true,
          children: [
            {
              title: 'index2.js',
              id: 'index2',
              children: [
                {
                  title: 'index3.js',
                  id: 'index3'
                },
                {
                  title: 'index4.js',
                  id: 'index4'
                },
                {
                  title: 'index5.js',
                  id: 'index5'
                },
                {
                  title: 'index6.js',
                  id: 'index6'
                },
                {
                  title: 'index8.js',
                  id: 'index8'
                }
              ]
            },
            {
              title: 'index7.js',
              id: 'index7'
            }
          ]
        }
      ]
    };
    console.log('dept constrcut');
  }

  componentDidMount() {
    // 获取部门结构，setstate
  }

  componentDidUpdate() {
    console.log('dept did update');
  }

  addNodeTextChange = e => {
    this.setState({ addNodeText: e.target.value.trim() });
    // this.props.dispatch(commonActions.showMessage(e.target.value));
  };
  addNodeTextClick = () => {
    // 添加根节点或者添加下级节点，如果添加下级节点，必须先选中一个父节点
    if (!this.state.treeNodeSelectedId) {
      this.props.dispatch(
        commonActions.showMessage('必须选择一个父节点', 'warn')
      );
    }
  };
  /**
   * tree的onChange方法，必须
   */
  handleTreeChange = treeData => this.setState({ treeData });
  /**
   * tree的node被点击后调用的方法，传入node的id属性
   */
  treeNodeSelected = id =>
    this.setState({
      treeNodeSelectedId: id === this.state.treeNodeSelectedId ? '' : id
    });
  render() {
    const { classes } = this.props;
    const { treeData, addNodeText, treeNodeSelectedId } = this.state;
    return (
      <Grid container spacing={40}>
        <Grid item xs={12} sm={5} container direction="column">
          <Grid item>
            <Typography variant="title" align="center">
              部门架构
            </Typography>
          </Grid>
          <Grid item xs>
            <Tree
              treeData={treeData}
              selected={treeNodeSelectedId}
              onSelected={this.treeNodeSelected}
              onChange={this.handleTreeChange}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm container spacing={24} direction="column">
          <Grid item container spacing={24}>
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
          {treeNodeSelectedId && <Grid item>{treeNodeSelectedId}</Grid>}
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
