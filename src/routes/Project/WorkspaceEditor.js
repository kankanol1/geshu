import React, { Component } from 'react';
import { Layout } from 'antd';
import WorkArea from './Workspace/WorkArea';
import WorkSpaceMenu from './WorkspaceMenu';
import WorkAreaMenu from './Workspace/WorkAreaMenu';

const { Header } = Layout;

export default class WorkspaceEditor extends Component {
  render() {
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light" >
        <Header style={{ padding: '0px', height: '48px', lineHeight: '46px', background: '#eee' }}>
          <WorkAreaMenu />
          <WorkSpaceMenu currentPath={this.props.location} />
        </Header>
        <Layout style={{ padding: '0', height: '100%' }} theme="light">
          <WorkArea />
        </Layout>
      </Layout>
    );
  }
}
