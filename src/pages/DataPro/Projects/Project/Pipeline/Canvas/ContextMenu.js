import React from 'react';
import router from 'umi/router';
import { Menu } from 'antd';

const style = {
  borderBottom: '1px solid #eee',
};

class ContextMenu extends React.PureComponent {
  handleComponentClick({ item, key, keyPath }) {
    const { dispatch, component, projectId } = this.props;
    const { id: operatorId } = component;
    switch (key) {
      case 'io':
        this.props.dispatch({
          type: 'dataproPipeline/modifyComponent',
          payload: {
            component,
          },
        });
        break;
      case 'settings':
        router.push(`/projects/p/pipeline/${projectId}/conf/${operatorId}`);
        break;
      case 'inspect':
        break;
      case 'runtothis':
        break;
      case 'delete':
        dispatch({
          type: 'dataproPipeline/deleteOp',
          payload: {
            id: operatorId,
            projectId,
          },
        });
        break;
      default:
        break;
    }
    dispatch({
      type: 'dataproPipeline/hideContextMenu',
    });
  }

  handleDatasetClick() {
    const { dispatch } = this.props;

    dispatch({
      type: 'dataproPipeline/hideContextMenu',
    });
  }

  renderDatasetMenu() {
    return (
      <Menu
        style={{ width: 140 }}
        mode="vertical"
        theme="light"
        onClick={v => this.handleDatasetClick(v)}
      >
        <Menu.Item key="settings" style={style}>
          预览数据
        </Menu.Item>
        <Menu.Item key="cleardata" style={style}>
          清除数据
        </Menu.Item>
      </Menu>
    );
  }

  renderOpMenu() {
    return (
      <Menu
        style={{ width: 140 }}
        mode="vertical"
        theme="light"
        onClick={v => this.handleComponentClick(v)}
      >
        <Menu.Item key="io" style={style}>
          修改连接
        </Menu.Item>
        <Menu.Item key="settings" style={style}>
          修改设置
        </Menu.Item>
        <Menu.Item key="runtothis" style={style}>
          执行到此处
        </Menu.Item>
        <Menu.Item key="delete" style={style}>
          删除
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { x, y, offsetY, offsetX, component } = this.props;
    const left = x - offsetX;
    const top = y - offsetY;
    return (
      <div
        style={{
          position: 'absolute',
          border: '1px solid #eee',
          top: `${top}px`,
          left: `${left}px`,
        }}
      >
        {component.type === 'Dataset' ? this.renderDatasetMenu() : this.renderOpMenu()}
      </div>
    );
  }
}

export default ContextMenu;
