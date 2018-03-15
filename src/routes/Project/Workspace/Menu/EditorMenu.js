import React from 'react';
import { Menu } from 'antd';

const { SubMenu } = Menu;

class EditorMenu extends React.PureComponent {
  render() {
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[]}
        mode="horizontal"
        style={{ background: 'transparent', float: 'left' }}
      >
        <SubMenu title={<span>项目</span>}>
          <Menu.Item key="open">打开</Menu.Item>
          <Menu.Item key="close">关闭</Menu.Item>
          <SubMenu title={<span>最近打开的项目</span>}>
            <Menu.Item key="recent-1">项目1</Menu.Item>
            <Menu.Item key="recent-2">项目2</Menu.Item>
            <Menu.Item key="recent-3">项目3</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu title={<span>调试</span>}>
          <Menu.Item key="sampledata">取样执行</Menu.Item>
          <Menu.Item key="samplepipeline">执行至指定组件</Menu.Item>
        </SubMenu>
        <SubMenu title={<span>部署</span>}>
          <Menu.Item key="submit">提交运行</Menu.Item>
        </SubMenu>
        <Menu.Item key="help">
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">帮助</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default EditorMenu;
