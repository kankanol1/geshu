import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Menu, Icon } from 'antd';

export default class WorkspaceViewMenu extends Component {
  render() {
    const path = this.props.currentPath.pathname;
    const pathArr = path.split('/');
    const selectedKey = pathArr[pathArr.length - 2];
    const projectId = pathArr[pathArr.length - 1];
    return (
      <Menu
        style={{ padding: '0px', background: 'transparent', float: 'right' }}
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={[selectedKey]}
      >
        <Menu.Item key="editor">
          <Link to={`../editor/${projectId}`}><Icon type="codepen" />设计器</Link>
        </Menu.Item>
        <Menu.Item key="dataview">
          <Link to={`../dataview/${projectId}`}><Icon type="table" />数据视图</Link>
        </Menu.Item>
        <Menu.Item key="logview">
          <Link to={`../logview/${projectId}`}><Icon type="profile" />日志查看</Link>
        </Menu.Item>
      </Menu>
    );
  }
}
