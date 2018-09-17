import React from 'react';
import { connect } from 'dva';
import { Layout, Tabs, Input, Select, Row, Col, List, Icon, Spin, Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import WorkspaceViewMenu from './WorkspaceViewMenu';

import WorkspaceMenu from './Menu/WorkspaceMenu';
import JobList from './OutputView/JobList';

import styles from './WorkspaceOutputView.less';
import JobOutput from './OutputView/JobOutput';
import ModelServingTest from '../../Model/ModelServingTest';
import ModelTestComponent from '../../Model/ModelTestComponent';
import DatasetDetailsComponent from '../../Dataset/Details/DatasetDetailsComponent';

const { Header } = Layout;
const { TabPane } = Tabs;
@connect(({ outputview, loading }) => ({
  outputview,
  loading: loading.models.outputview,
}))
export default class WorkspaceOutputView extends React.Component {
  handleJobClicked = (jobId) => {
    this.props.dispatch({
      type: 'outputview/addPane',
      payload: {
        id: jobId,
        type: 'job',
        title: `作业详细[${jobId}]`,
      },
    });
  }

  handleTabChange = (newKey) => {
    this.props.dispatch({
      type: 'outputview/activePane',
      payload: {
        title: newKey,
      },
    });
  }

  handleTabEdit = (key, action) => {
    if (action === 'remove') {
      this.props.dispatch({
        type: 'outputview/removePane',
        payload: {
          title: key,
        },
      });
    }
  }

  handleDataClicked = (id) => {
    // TODO
    this.props.dispatch({
      type: 'outputview/addPane',
      payload: {
        id,
        type: 'data',
        title: `数据查看[${id}]`,
      },
    });
  }

  handleModelClicked = (id) => {
    this.props.dispatch({
      type: 'outputview/addPane',
      payload: {
        id,
        type: 'model',
        title: `模型测试[${id}]`,
      },
    });
  }

  render() {
    const { id } = this.props.match.params;
    const { panes, defaultPane } = this.props.outputview;
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light" >
        <Header style={{ padding: '0px', height: '48px', lineHeight: '46px', background: '#eee' }}>
          <WorkspaceMenu env={['dataview']} />
          <WorkspaceViewMenu currentPath={this.props.location} />
        </Header>
        <Layout style={{ padding: '0', height: '100%' }} theme="light">
          <Tabs
            type="editable-card"
            hideAdd
            className={styles.tabs}
            activeKey={defaultPane}
            onChange={activeKey => this.handleTabChange(activeKey)}
            onEdit={(key, action) => this.handleTabEdit(key, action)}
          >
            <TabPane tab="作业历史" key="default" closable={false}>
              <Scrollbars style={{ padding: '0', height: '100%', overflow: 'auto' }}>
                <JobList id={id} onJobClicked={jobId => this.handleJobClicked(jobId)} />
              </Scrollbars>
            </TabPane>
            {
              panes.map((p, i) => {
                let content = null;
                if (p.type === 'job') {
                    content = (
                      <JobOutput
                        id={p.id}
                        onModelClicked={modelId => this.handleModelClicked(modelId)}
                        onDataClicked={dataId => this.handleDataClicked(dataId)}
                      />
                      );
                } else if (p.type === 'model') {
                  content = <ModelTestComponent id={p.id} />;
                } else if (p.type === 'data') {
                  content = <DatasetDetailsComponent datasetId={p.id} />;
                } else {
                  return null;
                }
                return (
                  <TabPane tab={p.title} key={p.title} >
                    <Scrollbars style={{ padding: '0', height: '100%', overflow: 'auto' }}>
                      {content}
                    </Scrollbars>
                  </TabPane>
                );
              })
            }
          </Tabs>
        </Layout>
      </Layout>
    );
  }
}
