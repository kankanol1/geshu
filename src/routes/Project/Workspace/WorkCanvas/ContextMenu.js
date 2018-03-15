import React from 'react';
import { Menu } from 'antd';

const style = {
  borderBottom: '1px solid #eee',
};

class ContextMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick({ item, key, keyPath }) {
    const { onSettingsClicked } = this.props;
    switch (key) {
      case 'settings':
        if (onSettingsClicked) {
          onSettingsClicked();
        }
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        border: '1px solid #eee',
        top: this.props.top,
        left: this.props.left,
      }}
      >
        <Menu
          style={{ width: 140 }}
          mode="vertical"
          theme="light"
          onClick={this.handleClick}
        >
          <Menu.Item key="settings" style={style}>
            查看设置
          </Menu.Item>
          <Menu.Item key="1" style={style}>
            执行到此处
          </Menu.Item>
          <Menu.Item key="2" style={style}>
            从此处开始执行
          </Menu.Item>
          <Menu.Item key="3" style={style}>
            查看数据
          </Menu.Item>
          <Menu.Item key="4">
            查看日志
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default ContextMenu;
