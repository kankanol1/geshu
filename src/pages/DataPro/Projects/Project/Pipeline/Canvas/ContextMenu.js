import React from 'react';
import { Menu } from 'antd';

const style = {
  borderBottom: '1px solid #eee',
};

class ContextMenu extends React.PureComponent {
  handleClick({ item, key, keyPath }) {
    const { onInspectClicked, onSettingsClicked, onRunToThisClicked, onDeleteClicked } = this.props;
    switch (key) {
      case 'settings':
        if (onSettingsClicked) {
          onSettingsClicked();
        }
        break;
      case 'inspect':
        if (onInspectClicked) {
          onInspectClicked();
        }
        break;
      case 'runtothis':
        if (onRunToThisClicked) {
          onRunToThisClicked();
        }
        break;
      case 'delete':
        if (onDeleteClicked) {
          onDeleteClicked();
        }
        break;
      default:
        break;
    }
  }

  renderDatasetMenu() {
    return (
      <Menu style={{ width: 140 }} mode="vertical" theme="light" onClick={v => this.handleClick(v)}>
        <Menu.Item key="settings" style={style}>
          预览数据
        </Menu.Item>
        <Menu.Item key="runtothis" style={style}>
          清除数据
        </Menu.Item>
      </Menu>
    );
  }

  renderOpMenu() {
    return (
      <Menu style={{ width: 140 }} mode="vertical" theme="light" onClick={v => this.handleClick(v)}>
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
