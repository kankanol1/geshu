import React from 'react';
import { Button, Icon } from 'antd';
import router from 'umi/router';
import styles from './EditTask.less';
import { validateTaskSource } from '@/services/dclient/taskAPI';

class EditTaskStepDataSourceCheck extends React.PureComponent {
  state = {
    loading: true,
    response: {},
  };

  componentDidMount() {
    const { id } = this.props;
    validateTaskSource({
      id,
    }).then(response => {
      if (response) {
        this.setState({ loading: false, response });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    const { mode, id, pane } = this.props;
    const { loading, response } = this.state;
    return (
      <div>
        {loading && (
          <div className={styles.middleWrapper}>
            <Icon type="loading" style={{ fontSize: '16px' }} /> 验证中...
          </div>
        )}
        {!loading &&
          response.success && (
            <div className={styles.middleWrapper}>
              <Icon type="check" style={{ fontSize: '16px', color: 'green' }} /> 核对完毕
            </div>
          )}
        {!loading &&
          !response.success && (
            <div className={styles.middleWrapper}>
              <Icon type="close" style={{ fontSize: '16px', color: 'red' }} /> {response.message}
            </div>
          )}
        <div className={styles.bottomBtns}>
          <Button
            type="primary"
            className={styles.leftBtn}
            onClick={() => router.push(`/tasks/t/${mode}/${id}/${pane - 1}`)}
          >
            &lt;上一步
          </Button>
          <Button
            type="primary"
            className={styles.rightBtn}
            disabled={loading || !response.success}
            onClick={() => router.push(`/tasks/t/${mode}/${id}/${pane + 1}`)}
          >
            下一步 &gt;
          </Button>
        </div>
      </div>
    );
  }
}

export default EditTaskStepDataSourceCheck;
