import React from 'react';
import { Icon, Layout, Card } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import PageLoading from '@/components/PageLoading';

import FileDataSource from './FileDataSourceAdd';
import TopBar from '../../../../TopBar';
import styles from './Index.less';

@connect(({ global, dataproProject, loading }) => ({
  project: dataproProject.project,
  global,
  loading: loading.effects['dataproProjects/fetchProject'],
}))
class Index extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'dataproProject/fetchProject',
      payload: { id },
    });
  }

  renderChildren = (pane, id) => {
    switch (pane) {
      case 'FileDataSource':
        return <FileDataSource id={id} />;
      default:
        return <div>404</div>;
    }
  };

  render() {
    const { loading, dispatch } = this.props;
    const { id, pane } = this.props.match.params;

    const { project } = this.props;
    if (loading || !project) return <PageLoading />;

    const { currentUser, collapsed, fullScreen } = this.props.global;
    const topBarProps = {
      id,
      title: project.name,
      path: `/projects/p/pipeline/${id}`, // pipeline.
      dispatch,
      currentUser,
      collapsed,
      fullScreen,
    };
    return (
      <Layout style={{ padding: '0', height: '100%', position: 'relative' }} theme="light">
        <TopBar {...topBarProps} />
        <div className={styles.divWrapper}>
          <div className={styles.titleWrapper}>
            <Link to={`/projects/p/pipeline/${id}`} className={styles.backTitle}>
              &lt;&nbsp;返回
            </Link>
            <div className={styles.titleContent}>
              <span className={styles.title}>新建</span>
            </div>
          </div>
          {this.renderChildren(pane, id)}
        </div>
      </Layout>
    );
  }
}

export default Index;
