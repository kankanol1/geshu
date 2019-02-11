import React from 'react';
import { Button, Modal, message } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import Result from '@/components/Result';
import { runTaskById } from '@/services/dclient/taskAPI';
import styles from './EditTask.less';

class EditTaskStepDataSinkCheck extends React.PureComponent {
  runTask() {
    const { id } = this.props;
    Modal.confirm({
      title: '确认提交',
      content: '是否确认提交运行？',
      okText: '确认',
      cancelTest: '取消',
      onOk: () => {
        runTaskById({ id }).then(response => {
          if (response && response.success) {
            message.info('已提交运行');
          } else {
            message.error(response.message || '提交失败，请重试');
          }
        });
      },
    });
  }

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
              <Button type="primary" onClick={() => this.runTask()}>
                提交运行
              </Button>
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
