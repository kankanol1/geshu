import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import styles from './EditTask.less';

class EditTaskStepDataSourceCheck extends React.Component {
  render() {
    const { mode, id, pane } = this.props;
    return (
      <div>
        此处显示数据源验证结果
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
