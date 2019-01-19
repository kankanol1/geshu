import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import { getDatasetInfoForId } from '@/services/datapro/datasetAPI';
import DetailOverview from './DetailOverview';
import DetailTable from './DetailTable';
import TopBar from '../../TopBar';
import styles from './Index.less';

const { TabPane } = Tabs;

@connect(({ global, dataproProject, loading }) => ({
  project: dataproProject.project,
  global,
  loading: loading.effects['dataproProjects/fetchProject'],
}))
class Index extends React.Component {
  state = {
    dataset: undefined,
    loading: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { id, datasetId } = this.props.match.params;
    dispatch({
      type: 'dataproProject/fetchProject',
      payload: { id },
    });
    // fetch dataset info.
    getDatasetInfoForId({ id: datasetId }).then(response => {
      if (response) {
        this.setState({ dataset: response, loading: false });
      }
    });
  }

  render() {
    const { loading, dispatch } = this.props;
    const { id, datasetId } = this.props.match.params;
    const { loading: datasetLoading, dataset } = this.state;

    const { project } = this.props;
    if (loading || !project || datasetLoading) return <PageLoading />;

    const { currentUser, collapsed, fullScreen } = this.props.global;
    const topBarProps = {
      id,
      title: project.name,
      path: `/projects/p/dataset/${id}`, // dataset.
      dispatch,
      currentUser,
      collapsed,
      fullScreen,
    };
    return (
      <PageHeaderWrapper
        // hiddenBreadcrumb
        title={`查看数据集：${dataset.name}[${dataset.id}]`}
        breadcrumbList={[
          {
            name: '项目详细',
            key: 'project',
            href: `/projects/p/show/${id}`,
          },
          {
            name: '数据集列表',
            key: 'datasets',
            href: `/projects/p/dataset/${id}`,
          },
          {
            key: 'dataset',
            name: '数据集预览',
          },
        ]}
        top={<TopBar {...topBarProps} />}
      >
        <div className={styles.wrapper}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="概览" key="1">
              <DetailOverview datasetId={datasetId} />
            </TabPane>
            <TabPane tab="数据" key="2">
              <DetailTable datasetId={datasetId} />
            </TabPane>
          </Tabs>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Index;
