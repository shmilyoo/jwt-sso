import React from 'react';
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core';
import Tree from '../../components/Tree';
import {
  getDeptArray,
  makeDeptTree,
  getLevel1ExpandsfromTreeArray
} from '../../services/utility';

/**
 * store存储数据格式为{id:deptId,names:'rootName-childName-...-deptName'}
 */
class RenderSelectDeptField extends React.PureComponent {
  state = {
    open: false,
    treeData: [],
    treeArray: [],
    selectedNode: {},
    inputValue: ''
  };

  handleTreeChange = treeData => {
    this.setState({ treeData });
  };
  handleInputClick = () => {
    this.setState({ open: true });
    if (!this.state.treeData.length) {
      getDeptArray().then(res => {
        if (res.success) {
          let level1Expands = getLevel1ExpandsfromTreeArray(res.data);
          const result = makeDeptTree(res.data, level1Expands);
          this.setState({ treeData: result, treeArray: res.data });
        }
      });
    }
  };

  handleSelectDept = () => {
    const nodeId = this.state.selectedNode.id;
    if (!this.nodes) {
      this.nodes = {};
      this.state.treeArray.forEach(({ id, parent_id, name }) => {
        this.nodes[id] = { id, parent_id, name };
      });
    }
    let titles = [];
    let current = nodeId;
    while (true) {
      titles.unshift(this.nodes[current].name);
      current = this.nodes[current].parent_id;
      if (current === '0') break;
    }
    //store存储数据格式为{id:deptId,names:'rootName-childName-...-deptName'}
    const names = titles.join('-');
    this.props.input.onChange({ id: nodeId, names });
    this.setState({ open: false });
    // this.setState({ open: false, inputValue: names });
  };

  handleCloseDialog = () => {
    this.setState({ open: false });
  };

  handleTreeNodeSelected = (id, title) => {
    this.setState({ selectedNode: { id, title } });
  };
  handleTreeNodeUnSelected = () => {
    this.setState({ selectedNode: {} });
  };

  render() {
    const {
      input: { value, onChange, onBlur, ...inputRest },
      label,
      meta: { touched, error },
      ...rest
    } = this.props;
    const { open, treeData } = this.state;
    return (
      <React.Fragment>
        <TextField
          label={label}
          {...inputRest}
          value={value && value.names}
          onBlur={() => onBlur()} // 因为field的value和显示的文字不同，这样避免onblur更改value
          fullWidth
          error={!!(touched && error)}
          helperText={touched && error ? error : ' '}
          InputProps={{ readOnly: true }}
          onClick={this.handleInputClick}
          {...rest}
        />
        <Dialog open={open} fullWidth>
          <DialogTitle>选择工作部门</DialogTitle>
          <DialogContent style={{ height: '500px' }}>
            <Tree
              hideHead
              canDrop={() => false}
              treeData={treeData}
              onChange={this.handleTreeChange}
              onTreeNodeSelected={this.handleTreeNodeSelected}
              onTreeNodeUnSelected={this.handleTreeNodeUnSelected}
            />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={!this.state.selectedNode.id}
              variant="contained"
              color="primary"
              onClick={this.handleSelectDept}
            >
              确定
            </Button>
            <Button variant="text" onClick={this.handleCloseDialog}>
              取消
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default RenderSelectDeptField;
