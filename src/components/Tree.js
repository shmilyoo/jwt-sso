import React from 'react';
import PropTypes from 'prop-types';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import '../assets/css/adminDeptTree.css'; // 自定义的一些样式

const Tree = ({
  treeData,
  onChange,
  selected,
  onSelected,
  onUnSelected,
  onCollapse
}) => {
  return (
    <SortableTree
      treeData={treeData}
      rowHeight={50}
      onChange={onChange}
      onVisibilityToggle={({ node, expanded }) => {
        onCollapse && onCollapse(node.id, expanded);
      }}
      getNodeKey={({ node }) => node.id}
      generateNodeProps={({ node, path, treeIndex }) => {
        return {
          style: { boxShadow: node.id === selected ? '0 0 0 2px blue' : '' },
          onClick: e => {
            // console.log(node, path, e.target.className, e);
            e.stopPropagation();
            if (
              e.target.className == 'rst__collapseButton' ||
              e.target.className == 'rst__expandButton' ||
              e.target.className == 'rst__moveHandle'
            ) {
              return; // 略过点击折叠按钮/移动手柄 触发选择事件
            }
            if (node.id === selected) {
              // 点击的节点id等于已经选中的id，触发取消选中事件
              onUnSelected && onUnSelected();
            } else {
              // 触发选中事件
              onSelected && onSelected(node.id, node.title);
            }
          }
        };
      }}
    />
  );
};

Tree.propTypes = {
  treeData: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSelected: PropTypes.func,
  onUnSelected: PropTypes.func
};

export default Tree;
