import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Tag, Button, Icon, Modal, message, Tooltip } from 'antd';
import router from 'umi/router';
import { status } from '@/utils/translationUtils';
import { runTaskById } from '@/services/dclient/taskAPI';
import styles from './TaskDetails.less';

@connect(({ task, loading }) => ({
  task: task.data,
  loading: loading.models.task,
}))
class TaskDetails extends React.Component {
  handleDelete() {
    const { id } = this.props;
    Modal.confirm({
      title: '确认删除',
      content: '是否确认删除？删除后任务及作业记录不可恢复！',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'tasks/deleteTask',
          payload: {
            ids: [parseInt(id, 10)],
          },
          callback: () => {
            message.info('已删除');
            router.push(`/tasks/list`);
          },
        });
      },
    });
  }

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
            message.error((response && response.message) || '提交失败，请重试');
          }
        });
      },
    });
  }

  jumpToConfig() {
    const { id } = this.props;
    router.push(`/tasks/t/edit/${id}`);
  }

  renderItems = list => {
    return (
      <div className={styles.listContainer}>
        {list.map((i, index) => (
          <div className={styles.listItem} key={index}>
            <div className={styles.listKey}>{i.key}</div>
            <div className={styles.listValue}>{i.value}</div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { task } = this.props;
    const btnProps = {
      type: 'primary',
      size: 'small',
    };
    const list = [
      {
        key: '名称',
        value: (
          <React.Fragment>
            {task.cronEnabled && (
              <Tooltip title="已设置定时执行">
                <Icon style={{ marginRight: '10px' }} type="clock-circle" />
              </Tooltip>
            )}
            <span>{task.name}</span>
          </React.Fragment>
        ),
      },
      { key: '描述', value: task.description },
      {
        key: '状态',
        value: (
          <React.Fragment>
            <Tag color={status.types[task.status]}>{status.names[task.status]}</Tag>
            {task.status === 'READY' && (
              <Button onClick={() => this.runTask()} {...btnProps}>
                提交运行
              </Button>
            )}
            {task.status === 'NOT_READY' && (
              <Button onClick={() => this.jumpToConfig()} {...btnProps}>
                配置
              </Button>
            )}
            {task.status === 'DONE' && (
              <Button onClick={() => this.runTask()} {...btnProps}>
                重新执行
              </Button>
            )}
          </React.Fragment>
        ),
      },
      { key: '创建时间', value: moment(task.createdAt).format('YYYY-MM-DD HH:mm:ss') },
      { key: '修改时间', value: moment(task.updatedAt).format('YYYY-MM-DD HH:mm:ss') },
    ];
    return (
      <React.Fragment>
        {this.renderItems(list)}
        <div className={styles.btnContainer}>
          <Button type="danger" onClick={() => this.handleDelete()}>
            <Icon type="delete" />
            删除
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default TaskDetails;
