import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.less';

import TopMenu from '../components/menus/TopMenu';
import LeftSideMenu from '../components/menus/LeftSideMenu';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function IndexPage() {
  return (
    <Layout>
    <TopMenu/>
    <Layout>
      <LeftSideMenu/>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          Content
        </Content>
      </Layout>
    </Layout>
  </Layout>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
