import React, { Component } from 'react';
import { Layout, Card } from 'antd';
import WorkSpaceMenu from './WorkspaceMenu';
import WorkAreaMenu from './Workspace/WorkAreaMenu';

const { Header } = Layout;

export default class WorkspaceLogView extends Component {
  render() {
    return (
      <Layout style={{ padding: '0' }} theme="light" >
        <Header style={{ padding: '0px', height: '48px', lineHeight: '46px', background: '#eee' }}>
          <WorkAreaMenu />
          <WorkSpaceMenu currentPath={this.props.location} />
        </Header>
        <Layout style={{ padding: '0', height: '100%' }} theme="light">
          <Card>
            <div>Hello log</div>
          </Card>
          <Card>
            <div>Here goes the log display</div>
          </Card>
        </Layout>
      </Layout>
    );
  }
}