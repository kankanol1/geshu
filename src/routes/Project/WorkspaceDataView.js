import React, { Component } from 'react';
import { Layout } from 'antd';
import WorkSpaceMenu from './WorkspaceMenu';

const { Header } = Layout;

export default class WorkspaceDataView extends Component {
  render() {
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light" >
        <Header style={{ padding: '0px', height: '48px', lineHeight: '46px', background: '#eee' }}>
          <WorkSpaceMenu currentPath={this.props.location} />
        </Header>
        <Layout style={{ padding: '0', height: '100%' }} theme="light">
          <div>Hello data</div>
        </Layout>
      </Layout>
    );
  }
}
