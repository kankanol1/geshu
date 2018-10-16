import React, { Component } from 'react';
import { Icon, Layout } from 'antd';
import { connect } from 'dva';
import WorkArea from './Designer/WorkArea';
import WorkspaceViewMenu from './WorkspaceViewMenu';
import WorkspaceMenu from './Menu/WorkspaceMenu';

const { Header } = Layout;
@connect(({ workcanvas, loading }, { history }) => ({
  workcanvas,
  loading: loading.models.workcanvas,
  history,
}))
class WorkspaceEditor extends Component {
  componentWillMount() {
    const { match } = this.props;
    this.props.dispatch({
      type: 'workcanvas/initProject',
      payload: {
        id: match.params.id,
      },
    });
  }

  render() {
    const {
      name,
      state: { dirty },
    } = this.props.workcanvas;
    const { loading } = this.props;
    return (
      <Layout style={{ padding: '0', height: '100%', position: 'relative' }} theme="light">
        <Header style={{ padding: '0px', height: '48px', lineHeight: '46px', background: '#eee' }}>
          <WorkspaceMenu env={['editor']} match={this.props.match} />
          <div style={{ float: 'left', marginLeft: '15%', fontWeight: '900' }}>
            {loading ? <Icon type="loading" /> : null}
            {name === undefined ? null : `项目[${name}]`}
            {dirty ? '  *' : null}
          </div>
          <WorkspaceViewMenu currentPath={this.props.location} />
        </Header>
        <Layout style={{ padding: '0', zIndex: '0' }} theme="light">
          <WorkArea match={this.props.match} />
        </Layout>
      </Layout>
    );
  }
}

export default WorkspaceEditor;
