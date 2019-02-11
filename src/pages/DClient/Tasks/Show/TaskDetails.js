import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Tag, Button, Icon, Modal, message } from 'antd';
import router from 'umi/router';
import { status } from '@/utils/translationUtils';
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
      { key: '名称', value: task.name },
      { key: '描述', value: task.description },
      {
        key: '状态',
        value: (
          <React.Fragment>
            <Tag color={status.types[task.status]}>{status.names[task.status]}</Tag>
            {task.status === 'READY' && <Button {...btnProps}>提交运行</Button>}
            {task.status === 'NOT_READY' && <Button {...btnProps}>配置</Button>}
            {task.status === 'DONE' && <Button {...btnProps}>重新执行</Button>}
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
