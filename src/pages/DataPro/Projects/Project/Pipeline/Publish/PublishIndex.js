import React from 'react';
import { Layout, Form, Button } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import PageLoading from '@/components/PageLoading';
import { queryPipelinePublishMeta } from '@/services/datapro/pipelineAPI';

import TopBar from '../../../TopBar';
import PublishDescribeInput from './PublishDescribeInput';
import PublishDescribeOutput from './PublishDescribeOutput';
import PublishDescribe from './PublishDescribe';
import PublishResult from './PublishResult';
import styles from './PublishIndex.less';

const steps = [PublishDescribeInput, PublishDescribeOutput, PublishDescribe, PublishResult];

@connect(({ global, dataproProject, loading }) => ({
  project: dataproProject.project,
  global,
  projectLoading: loading.effects['dataproProjects/fetchProject'],
}))
@Form.create()
class PublishIndex extends React.PureComponent {
  state = {
    loading: false,
    step: 0,
    info: undefined,
    values: undefined,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'dataproProject/fetchProject',
      payload: { id },
    });
    // query pipeline meta.
    queryPipelinePublishMeta({ id }).then(response => {
      if (response) {
        this.setState({ info: response });
      }
    });
  }

  renderChildren(id) {
    const { step, info, values } = this.state;
    const Comp = steps[step];
    return (
      <Comp
        id={id}
        meta={info}
        values={values}
        next={formValues => {
          this.setState({ values: { ...values, ...formValues }, step: step + 1 });
        }}
        back={() => this.setState({ step: step - 1 })}
      />
    );
  }

  renderError = id => {
    return (
      <div className={styles.resultWrapper}>
        <div className={styles.loadingText}>无数据源或数据存储组件，无法发布！</div>
        <div className={styles.btnWrapper}>
          <Link to={`/projects/p/pipeline/${id}`}>
            <Button type="primary">返回</Button>
          </Link>
        </div>
      </div>
    );
  };

  render() {
    const { projectLoading, dispatch, project } = this.props;
    const { id } = this.props.match.params;

    if (projectLoading || !project || this.state.loading || !this.state.info)
      return <PageLoading />;

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
    const { inputs, outputs } = this.state.info;
    const canPublish = inputs.length > 0 && outputs.length > 0;
    return (
      <Layout style={{ padding: '0', height: '100%', position: 'relative' }} theme="light">
        <TopBar {...topBarProps} />

        <div className={styles.divWrapper}>
          <div className={styles.titleWrapper}>
            <Link to={`/projects/p/pipeline/${id}`} className={styles.backTitle}>
              &lt;&nbsp;返回
            </Link>
            <div className={styles.titleContent}>
              <span className={styles.title}>发布为模版 </span>
            </div>
          </div>
          {canPublish ? this.renderChildren(id) : this.renderError(id)}
        </div>
      </Layout>
    );
  }
}

export default PublishIndex;
