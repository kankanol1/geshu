import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Menu, Icon } from 'antd';

export default class WorkspaceMenu extends Component {
  render() {
    const path = this.props.currentPath.pathname;
    const selectedKey = path.substr(path.lastIndexOf('/') + 1, path.length);
    return (
      <Menu
        style={{ padding: '0px', background: 'transparent', float: 'right' }}
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={[selectedKey]}
      >
        <Menu.Item key="editor">
          <Link to="editor"><Icon type="codepen" />设计器</Link>
        </Menu.Item>
        <Menu.Item key="dataview">
          <Link to="dataview"><Icon type="table" />数据视图</Link>
        </Menu.Item>
        <Menu.Item key="logview">
          <Link to="logview"><Icon type="profile" />日志查看</Link>
        </Menu.Item>
      </Menu>
    );
  }
}
