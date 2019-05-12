import React, { PureComponent } from 'react';
import { Icon, Layout } from 'antd';
import { connect } from 'dva';
import { Redirect } from 'react-router-dom';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PageLoading from '@/components/PageLoading';
import XTagList from '@/components/XTagList';

import Index from './Project/Index';
import Versions from './Project/Versions';
import Settings from './Project/Settings';
import Files from './Project/Files';
import Dataset from './Project/Dataset';
import Pipeline from './Project/Pipeline';
import TopBar from './TopBar';

import { generateColorFor } from '../../../utils/utils';
import styles from './ProjectIndex.less';
import Template from './Project/Template';

const getPaneConfig = project => {
  return {
    show: {
      key: 'show',
      title: project.name,
    },
    templates: {
      key: 'templates',
      title: '已发布模版列表',
    },
    versions: {
      key: 'versions',
      title: '修改历史',
    },
    settings: {
      key: 'settings',
      title: '项目设置',
    },
    files: {
      key: 'files',
      title: '项目文件',
    },
    dataset: {
      key: 'dataset',
      title: '数据集',
    },
    pipeline: {
      key: 'pipeline',
      // FIXME: 修改代码结构解决如下扩展问题：
      // 若无标题，需使用fixHeight，把标题栏的空余空间略去，同时需在XBasicLayout中注册相应fixedHeight的地址
      // fixedHeight 用于解决使用PageHeaderWrapper之后，显示会出现24px的空白条。
      fixedHeight: true,
      // title: '数据流程',
    },
  };
};

@connect(({ global, dataproProject, loading }) => ({
  project: dataproProject.project,
  global,
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
    dispatch({
      type: 'global/changeFullScreen',
      payload: true,
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
      case 'templates':
        return <Template {...props} />;
      case 'settings':
        return <Settings {...props} />;
      // case 'dashboard':
      //   return <Dashboard {...props} />;
      case 'dataset':
        return <Dataset {...props} />;
      case 'files':
        return <Files {...props} />;
      case 'pipeline':
        return <Pipeline {...props} />;
      default:
        return <Redirect to="/exception/404" />;
    }
  }

  renderContent(pane) {
    const { project } = this.props;
    const { id } = this.props.match.params;
    const labels = project.labels || [];
    switch (pane) {
      case 'show':
        return (
          <div>
            <p>{project.description}</p>
            <XTagList
              tooltip="编辑标签"
              editable
              tags={labels.map(i => ({ color: generateColorFor(i, '70%'), name: i }))}
              distinct
              onAdd={text => ({ color: generateColorFor(text, '70%'), name: text })}
              onChanged={newTags => {
                this.props.dispatch({
                  type: 'dataproProject/updateProjectLabels',
                  payload: {
                    id,
                    labels: newTags.map(i => i.name),
                  },
                });
              }}
            />
          </div>
        );
      default:
        return undefined;
    }
  }

  render() {
    const { loading, dispatch } = this.props;
    const { pathname } = this.props.location;
    const { id, pane } = this.props.match.params;

    const { project } = this.props;
    if (loading || !project || !project.id) return <PageLoading />;
    const renderConfig = getPaneConfig(project)[pane] || {};

    const { currentUser, collapsed, fullScreen } = this.props.global;
    const topBarProps = {
      id,
      title: project.name,
      path: pathname,
      dispatch,
      currentUser,
      collapsed,
      fullScreen,
    };

    return renderConfig.fixedHeight ? (
      <Layout style={{ padding: '0', height: '100%', position: 'relative' }} theme="light">
        <TopBar {...topBarProps} />
        {this.renderChildren(pane)}
      </Layout>
    ) : (
      <PageHeaderWrapper
        className={!renderConfig.title && !renderConfig.content && styles.noPadding}
        hiddenBreadcrumb
        title={renderConfig.title}
        content={this.renderContent(pane)}
        top={<TopBar {...topBarProps} />}
      >
        {this.renderChildren(pane)}
      </PageHeaderWrapper>
    );
  }
}

export default ProjectIndex;
