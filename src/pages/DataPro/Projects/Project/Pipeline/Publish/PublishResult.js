import React from 'react';
import { Spin, Button } from 'antd';
import { Link } from 'dva/router';

import { publishPipeline } from '@/services/datapro/pipelineAPI';
import styles from './PublishIndex.less';

class PublishResult extends React.PureComponent {
  state = {
    loading: true,
    response: undefined,
  };

  componentDidMount() {
    const { values } = this.props;
    publishPipeline(values).then(response => {
      if (response) {
        this.setState({ response, loading: false });
      }
    });
  }

  showResult() {
    const { id, back } = this.props;
    const { response } = this.state;
    return (
      <React.Fragment>
        <div className={styles.loadingText}>{response.message}</div>
        {response.success && (
          <Link to={`/projects/p/pipeline/${id}`}>
            <Button type="primary">完成</Button>
          </Link>
        )}
        {!response.success && (
          <Button type="primary" onClick={() => back()}>
            返回
          </Button>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { loading } = this.state;
    return (
      <div className={styles.resultWrapper}>
        {loading && (
          <div className={styles.loadingText}>
            <Spin /> 创建中{' '}
          </div>
        )}
        {!loading && this.showResult()}
      </div>
    );
  }
}

export default PublishResult;
