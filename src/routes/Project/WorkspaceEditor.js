import React, { Component } from 'react';
import { Icon, Layout } from 'antd';
import { connect } from 'dva';
import WorkArea from './Workspace/WorkArea';
import WorkSpaceMenu from './WorkspaceMenu';
import EditorMenu from './Workspace/Menu/EditorMenu';

const { Header } = Layout;
@connect(({ work_canvas, loading }, { history }) => ({
  work_canvas,
  loading: loading.models.work_canvas,
  history,
}))
export default class WorkspaceEditor extends Component {
  render() {
    const { name, state: { dirty } } = this.props.work_canvas;
    const { loading } = this.props;
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light" >
        <Header style={{ padding: '0px', height: '48px', lineHeight: '46px', background: '#eee' }}>
          <EditorMenu />
          <div style={{ float: 'left', marginLeft: '15%', fontWeight: '900' }}>
            {loading ? <Icon type="loading" /> : `项目[${name}]`}
            {dirty ? '  *' : null}
          </div>
          <WorkSpaceMenu currentPath={this.props.location} />
        </Header>
        <Layout style={{ padding: '0', height: '100%' }} theme="light">
          <WorkArea match={this.props.match} />
        </Layout>
      </Layout>
    );
  }
}
