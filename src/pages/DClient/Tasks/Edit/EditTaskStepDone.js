import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import Result from '@/components/Result';
import styles from './EditTask.less';

class EditTaskStepDataSinkCheck extends React.Component {
  render() {
    const { mode, id, pane } = this.props;
    return (
      <div>
        <Result
          type="success"
          title="配置完毕"
          description="任务信息配置完毕，可提交运行或返回查看任务信息"
          // extra={extra}
          actions={
            <div>
              <Button type="primary">提交运行</Button>
              <Link to={`/tasks/t/show/${id}`}>
                <Button>查看任务</Button>
              </Link>
            </div>
          }
          style={{ width: '100%' }}
        />
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
            onClick={() => router.push(`/tasks/t/show/${id}`)}
          >
            任务信息 &gt;
          </Button>
        </div>
      </div>
    );
  }
}

export default EditTaskStepDataSinkCheck;
