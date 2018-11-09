import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Redirect } from 'react-router-dom';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PageLoading from '@/components/PageLoading';
import XTagList from '@/components/XTagList';

import Index from './Project/Index';
import Versions from './Project/Versions';
import Settings from './Project/Settings';
import Dashboard from './Project/Dashboard';
import Dataset from './Project/Dataset';
import Pipeline from './Project/Pipeline';
import { renderTopBar } from './Utils';

import styles from './ProjectIndex.less';

const getPaneConfig = project => {
  return {
    show: {
      title: project.name,
      content: (
        <div>
          <p>{project.description}</p>
          <XTagList editable tags={[{ color: 'volcano', name: 'label' }]} />
        </div>
      ),
      component: Index,
    },
    versions: {
      title: '修改历史',
      component: Versions,
    },
    settings: {
      title: '项目设置',
      component: Settings,
    },
    dashboard: {
      title: '看板',
      component: Dashboard,
    },
    dataset: {
      title: '数据集',
      component: Dataset,
    },
    pipeline: {
      // title: '数据流程',
      component: Pipeline,
    },
  };
};

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  loading: loading.models.dataproProject,
}))
class ProjectIndex extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'dataproProject/fetchProject',
      payload: { id },
    });
  }

  render() {
    const { loading } = this.props;
    const { pathname } = this.props.location;
    const { id, pane } = this.props.match.params;

    if (loading) return <PageLoading />;
    const { project } = this.props.dataproProject;

    const renderConfig = getPaneConfig(project)[pane];

    if (!renderConfig) {
      // redirect to 403.
      return <Redirect to="/exception/404" />;
    }

    return (
      <PageHeaderWrapper
        className={!renderConfig.title && !renderConfig.content && styles.noPadding}
        hiddenBreadcrumb
        title={renderConfig.title}
        content={renderConfig.content}
        top={renderTopBar(id, project.name, pathname)}
      >
        <renderConfig.component match={this.props.match} />
      </PageHeaderWrapper>
    );
  }
}

export default ProjectIndex;
