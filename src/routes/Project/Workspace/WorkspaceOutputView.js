import React from 'react';
import { Layout, Tabs, Input, Select, Row, Col, List, Icon, Spin, Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import WorkspaceViewMenu from './WorkspaceViewMenu';

import WorkspaceMenu from './Menu/WorkspaceMenu';
import JobList from './OutputView/JobList';

import styles from './WorkspaceOutputView.less';

const { Header } = Layout;
const { TabPane } = Tabs;

export default class WorkspaceOutputView extends React.Component {
  handleJobClicked = (jobId) => {
  }

  render() {
    const { id } = this.props.match.params;
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light" >
        <Header style={{ padding: '0px', height: '48px', lineHeight: '46px', background: '#eee' }}>
          <WorkspaceMenu env={['dataview']} />
          <WorkspaceViewMenu currentPath={this.props.location} />
        </Header>
        <Layout style={{ padding: '0', height: '100%' }} theme="light">
          <Tabs type="editable-card" hideAdd className={styles.tabs}>
            <TabPane tab="作业历史" closable={false}>
              <Scrollbars style={{ padding: '0', height: '100%', overflow: 'auto' }}>
                <JobList id={id} onJobClicked={jobId => this.handleJobClicked(jobId)} />
              </Scrollbars>
            </TabPane>
          </Tabs>
        </Layout>
      </Layout>
    );
  }
}
