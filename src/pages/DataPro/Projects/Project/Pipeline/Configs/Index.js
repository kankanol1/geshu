import React from 'react';
import { Icon, Layout, Card, Spin } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import PageLoading from '@/components/PageLoading';

import { getOperatorInPipeline } from '@/services/datapro/pipelineAPI';
import FileDataSource from './DataSource/FileDataSourceAdd';
import FilterTransformer from './Transformer/FilterTransformer';
import PrepareTransformer from './Transformer/PrepareTransformerShit';
import TopBar from '../../../TopBar';
import styles from './Index.less';

const registered = {
  FileDataSource: FileDataSource, // eslint-disable-line
  FilterTransformer: FilterTransformer, // eslint-disable-line
  PrepareTransformer: PrepareTransformer, // eslint-disable-line
};

@connect(({ global, dataproProject, loading }) => ({
  project: dataproProject.project,
  global,
  loading: loading.effects['dataproProjects/fetchProject'],
}))
class Index extends React.Component {
  state = {
    loading: true,
    operator: undefined,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { id, op } = this.props.match.params;
    dispatch({
      type: 'dataproProject/fetchProject',
      payload: { id },
    });
    getOperatorInPipeline({ id, opId: op }).then(response => {
      this.setState({ loading: false, operator: response });
    });
  }

  renderChildren = (code, id, opId, name) => {
    const Pane = registered[code];
    if (Pane) {
      return <Pane id={id} code={code} opId={opId} name={name} />;
    } else {
      return <div>404</div>;
    }
  };

  render() {
    const { loading, dispatch } = this.props;
    const { id } = this.props.match.params;

    const { project } = this.props;
    if (loading || !project || this.state.loading) return <PageLoading />;

    const { currentUser, collapsed, fullScreen } = this.props.global;
    const { operator } = this.state;
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
              <span className={styles.title}>配置组件: {operator.name}</span>
              <span style={{ color: 'grey', display: 'inline-block', float: 'right' }}>
                ID: {operator.id}
              </span>
            </div>
          </div>
          {this.renderChildren(operator.code, id, operator.id, operator.name)}
        </div>
      </Layout>
    );
  }
}

export default Index;
