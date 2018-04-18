import React from 'react';
import { Tree, Icon, Alert } from 'antd';
import { connect } from 'dva';

const hasUnLoadNode = (node) => {
  let status = false;
  const loop = data => data.forEach((item) => {
    if (item.props.dataRef.children && !status) {
      if (item.props.dataRef.children.length === 0) {
        status = true;
      } else {
        loop(item.props.children);
      }
    }
  });
  loop(node);
  return status;
};

const { TreeNode } = Tree;
class FileSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      unLoadAlert: false,
    };
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys, e) => {
    const canCheck = hasUnLoadNode([e.node]);
    if (!canCheck) {
      this.setState({
        checkedKeys,
        unLoadAlert: false,
      });
      this.props.onChange(checkedKeys);
    } else {
      this.setState({
        unLoadAlert: true,
      });
    }
  }
  onLoadData= node => new Promise((resolve, reject) => {
    if (node.props.dataRef.children.length > 0) { resolve(); } else {
      this.props.dispatch({
        type: 'graph_mapping_editor/loadFile',
        payload: node.props.dataRef.path,
        resolve,
        reject,
      });
    }
  })
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.isdir) {
        return (
          <TreeNode
            title={<span><Icon type="folder" />   {item.title}</span>}
            key={item.key}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={<span><Icon type="file" />   {item.title}</span>}
          isLeaf
          key={item.key}
          dataRef={item}
        />
      );
    });
  }
  render() {
    return (
      <div>
        {this.state.unLoadAlert ? <Alert message="无法选中，原因：子节点未完全加载" banner /> : null}
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <Tree
            loadData={this.onLoadData}
            checkable
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
          >
            {this.renderTreeNodes(this.props.files)}
          </Tree>
        </div>
      </div>
    );
  }
}
export default connect(({ graph_mapping_editor }) => {
  return { dataSource: graph_mapping_editor.datasources, ...graph_mapping_editor };
})(FileSelector);

