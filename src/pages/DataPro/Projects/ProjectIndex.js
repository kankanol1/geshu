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

import { generateColorFor } from '../../../utils/utils';
import styles from './ProjectIndex.less';

const getPaneConfig = project => {
  return {
    show: {
      key: 'show',
      title: project.name,
    },
    versions: {
      key: 'versions',
      title: '修改历史',
    },
    settings: {
      key: 'settings',
      title: '项目设置',
    },
    dashboard: {
      key: 'dashboard',
      title: '看板',
    },
    dataset: {
      key: 'dataset',
      title: '数据集',
    },
    pipeline: {
      key: 'pipeline',
      // title: '数据流程',
    },
  };
};

@connect(({ dataproProject, loading }) => ({
  project: dataproProject.project,
  loading: loading.effects['dataproProjects/fetchProject'],
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

  renderChildren(pane) {
    const { match } = this.props;
    const props = { match };
    switch (pane) {
      case 'show':
        return <Index {...props} />;
      case 'versions':
        return <Versions {...props} />;
      case 'settings':
        return <Settings {...props} />;
      case 'dashboard':
        return <Dashboard {...props} />;
      case 'dataset':
        return <Dataset {...props} />;
      case 'pipeline':
        return <Pipeline {...props} />;
      default:
        return <Redirect to="/exception/404" />;
    }
  }

  renderContent(pane) {
    const { project } = this.props;
    switch (pane) {
      case 'show':
        return (
          <div>
            <p>{project.description}</p>
            <XTagList
              editable
              tags={project.labels.map(i => ({ color: generateColorFor(i), name: i }))}
            />
          </div>
        );
      default:
        return undefined;
    }
  }

  render() {
    const { loading } = this.props;
    const { pathname } = this.props.location;
    const { id, pane } = this.props.match.params;

    const { project } = this.props;
    if (loading || !project) return <PageLoading />;
    const renderConfig = getPaneConfig(project)[pane] || {};

    return (
      <PageHeaderWrapper
        className={!renderConfig.title && !renderConfig.content && styles.noPadding}
        hiddenBreadcrumb
        title={renderConfig.title}
        content={this.renderContent(pane)}
        top={renderTopBar(id, project.name, pathname)}
      >
        {this.renderChildren(pane)}
      </PageHeaderWrapper>
    );
  }
}

export default ProjectIndex;
