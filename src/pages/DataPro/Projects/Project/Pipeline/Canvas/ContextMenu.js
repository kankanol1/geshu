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
        dispatch({
          type: 'dataproPipeline/runToOp',
          payload: {
            id: operatorId,
            projectId,
          },
        });
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

  handleDatasetClick({ item, key, keyPath }) {
    const { dispatch, component, projectId } = this.props;
    const { id: operatorId } = component;
    switch (key) {
      case 'runtothis':
        dispatch({
          type: 'dataproPipeline/runToOp',
          payload: {
            id: operatorId,
            projectId,
          },
        });
        break;
      case 'inspect':
        dispatch({
          type: 'dataproPipeline/setInspectingComponent',
          payload: {
            component,
          },
        });
        break;
      case 'invalid':
        dispatch({
          type: 'dataproPipeline/invalidOp',
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

  renderCalculatedDatasetMenu = () => {
    return (
      <Menu
        style={{ width: 140 }}
        mode="vertical"
        theme="light"
        onClick={v => this.handleDatasetClick(v)}
      >
        <Menu.Item key="inspect" style={style}>
          预览数据
        </Menu.Item>
        <Menu.Item key="invalid" style={style}>
          清除数据
        </Menu.Item>
        <Menu.Item key="runtothis" style={style}>
          重新计算
        </Menu.Item>
      </Menu>
    );
  };

  renderEmpotyDatasetMenu = () => {
    return (
      <Menu
        style={{ width: 140 }}
        mode="vertical"
        theme="light"
        onClick={v => this.handleDatasetClick(v)}
      >
        <Menu.Item key="runtothis" style={style}>
          计算数据集
        </Menu.Item>
      </Menu>
    );
  };

  renderDatasetMenu() {
    const { status, component } = this.props;
    const componentStatus = status && status[component.id] && status[component.id].status;
    if (componentStatus === 'CALCULATED') {
      return this.renderCalculatedDatasetMenu();
    } else if (componentStatus === 'EMPTY') {
      return this.renderEmpotyDatasetMenu();
    }
    return null;
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