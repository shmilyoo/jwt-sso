import React from 'react';
import PropTypes from 'prop-types';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import '../assets/css/adminDeptTree.css'; // 自定义的一些样式

const Tree = ({ treeData, onChange, selected, onSelected }) => {
  return (
    <SortableTree
      treeData={treeData}
      rowHeight={50}
      // slideRegionSize={100}
      // scaffoldBlockPxWidth={44}
      // innerStyle={}  tree的容器区域，可滚动区域
      // style={{ backgroundColor: '#500' }}
      onChange={onChange}
      getNodeKey={({ node }) => node.id}
      generateNodeProps={({ node, path, treeIndex }) => {
        return {
          style: { boxShadow: selected === node.id ? '0 0 0 2px gray' : '' },
          onClick: e => {
            if (
              e.target.className == 'rst__collapseButton' ||
              e.target.className == 'rst__expandButton' ||
              e.target.className == 'rst__moveHandle'
            ) {
              return; // 略过点击折叠按钮
            }
            onSelected && onSelected(node.id);
            console.log(treeIndex, path, node, e.target.className);
          }
          // title: {},
        };
      }}
    />
  );
};

Tree.propTypes = {
  treeData: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSelected: PropTypes.func
};

export default Tree;
