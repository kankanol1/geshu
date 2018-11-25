import React from 'react';
import { Menu } from 'antd';

const style = {
  borderBottom: '1px solid #eee',
};

class ContextMenu extends React.PureComponent {
  handleClick({ item, key, keyPath }) {
    const { onInspectClicked, onSettingsClicked, onRunToThisClicked } = this.props;
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
      default:
        break;
    }
  }

  render() {
    const { x, y, offsetY, offsetX } = this.props;
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
        <Menu
          style={{ width: 140 }}
          mode="vertical"
          theme="light"
          onClick={v => this.handleClick(v)}
        >
          <Menu.Item key="settings" style={style}>
            查看设置
          </Menu.Item>
          <Menu.Item key="runtothis" style={style}>
            执行到此处
          </Menu.Item>
          {/* <Menu.Item key="2" style={style}>
            从此处开始执行
          </Menu.Item> */}
          <Menu.Item key="inspect" style={style}>
            数据预览
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default ContextMenu;
