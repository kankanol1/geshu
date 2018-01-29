import React from 'react';
import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class WorkAreaMenu extends React.PureComponent {

    state = {
        current: 'mail',
      }
      handleClick = (e) => {
        console.log('click ', e);
      }

    render() {
        return <Menu
        onClick={this.handleClick}
        selectedKeys={[]}
        mode="horizontal"
        style={{background:'#fafafa'}}
      >
        <SubMenu title={<span>文件</span>}>
            <Menu.Item key="save">存储</Menu.Item>
            <Menu.Item key="open">打开</Menu.Item>
            <Menu.Item key="close">关闭</Menu.Item>
            <Menu.Item key="import">导入</Menu.Item>
            <Menu.Item key="export">导出</Menu.Item>
        </SubMenu>
        <SubMenu title={<span>项目</span>}>
            <Menu.Item key="submit">提交运行</Menu.Item>
        </SubMenu>
        <Menu.Item key="help">
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">帮助</a>
        </Menu.Item>
      </Menu>
    }
}

export default WorkAreaMenu;