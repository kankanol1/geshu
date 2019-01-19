import React from 'react';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import TopBar from '../../TopBar';
import styles from './Index.less';

@connect(({ global, dataproProject, loading }) => ({
  project: dataproProject.project,
  global,
  loading: loading.effects['dataproProjects/fetchProject'],
}))
class Index extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id, dashboardId } = this.props.match.params;
    dispatch({
      type: 'dataproProject/fetchProject',
      payload: { id },
    });
  }

  render() {
    const { loading, dispatch } = this.props;
    const { id, dashboardId } = this.props.match.params;

    const { project } = this.props;
    if (loading || !project) return <PageLoading />;

    const { currentUser, collapsed, fullScreen } = this.props.global;
    const topBarProps = {
      id,
      title: project.name,
      path: `/projects/p/dashboard/${id}`, // datashboard
      dispatch,
      currentUser,
      collapsed,
      fullScreen,
    };
    return (
      <PageHeaderWrapper
        // hiddenBreadcrumb
        // title={`数据看板：${dataset.name}[${dataset.id}]`}
        breadcrumbList={[
          {
            name: '项目详细',
            key: 'project',
            href: `/projects/p/show/${id}`,
          },
          {
            name: '数据看板列表',
            key: 'dashboards',
            href: `/projects/p/dashboard/${id}`,
          },
          {
            key: 'dashboard',
            name: '数据看板详细',
          },
        ]}
        top={<TopBar {...topBarProps} />}
      >
        <div className={styles.wrapper}>
          <div>
            {id} - {dashboardId}
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Index;
