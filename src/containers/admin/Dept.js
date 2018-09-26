import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  withStyles,
  TextField,
  Button,
  Divider,
  Typography
} from '@material-ui/core';
import axios from 'axios';
import compose from 'recompose/compose';
import { reduxForm } from 'redux-form';
import { actions as commonActions } from '../../reducers/common';
import { addDept, getDeptWithParent } from '../../services/utility';
import DeptTree from '../../components/DeptTree';
import DeptForm from '../../forms/admin/DeptForm';
// import DeptForm from '../../forms/admin/DeptForm';

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
  modeLink: {
    paddingLeft: '2rem',
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' }
  }
});

class Dept extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeNodeSelected: {
        id: '',
        title: '',
        symbol: '',
        intro: '',
        parentName: '',
        parentId: ''
      },
      mode: 'viewEdit' // viewEdit 或者 add，浏览编辑模式或者添加模式
    };
    this.deptTreeRef = React.createRef();
    console.log('dept constrcut 222');
  }
  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   if (nextState.mode !== this.state.mode) return true;
  //   return true;
  // }

  componentDidUpdate() {
    console.log('dept did update');
  }
  componentDidMount() {
    console.log('dept did mount');
    this.props.dispatch(commonActions.changeTitle('部门架构管理'));
  }

  addNodeTextClick = () => {
    // 添加根节点或者添加下级节点，如果添加下级节点，必须先选中一个父节点
  };
  deptTreeNodeSelected = (id, title) => {
    getDeptWithParent(id).then(res => {
      if (res.success && res.data) {
        this.setState({
          treeNodeSelected: {
            id: res.data.id,
            title: res.data.name,
            symbol: res.data.symbol,
            intro: res.data.intro,
            parentId: res.data.parent_id,
            parentName: res.data.parent ? res.data.parent.name : ''
          }
        });
      }
    });
  };
  deptTreeNodeUnSelected = () => {
    this.setState({
      treeNodeSelected: {}
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
          if (res.success) {
            this.deptTreeRef.current.refreshTreeData();
            this.props.dispatch({
              type: '@@redux-form/RESET',
              meta: {
                form: 'addDeptForm'
              }
            });
          } else {
            this.props.dispatch(commonActions.showMessage(res.error, 'error'));
          }
        });
    } else {
    }
  };
  render() {
    console.log('dept render');
    const { classes } = this.props;
    const {
      treeNodeSelected: { id, title, symbol, intro, parentName },
      mode
    } = this.state;
    console.log(
      `mode is ${mode}, render dept. treeNodeSelectedTitle is ${title}`
    );
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} sm={5}>
          <DeptTree
            innerRef={this.deptTreeRef}
            deptTreeNodeSelected={this.deptTreeNodeSelected}
            deptTreeNodeUnSelected={this.deptTreeNodeUnSelected}
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
            enableReinitialize
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
