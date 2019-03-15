import React from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Tabs, Button, Icon, Menu } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import TaskDetails from './Show/TaskDetails';
import TaskJobs from './Show/TaskJobs';
import UpdateTaskInfo from './Edit/UpdateTaskInfo';

const { TabPane } = Tabs;
const { SubMenu, ItemGroup: MenuItemGroup } = Menu;

@connect(({ task, loading }) => ({
  task: task.data,
  loading: loading.models.task,
}))
class TaskIndex extends React.Component {
  state = {
    updating: false,
  };

  componentDidMount() {
    this.reload();
  }

  reload() {
    const { id } = this.props.match.params;
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: {
        id,
      },
    });
  }

  navigate(newPane) {
    const { id, pane } = this.props.match.params;
    router.push(`/tasks/t/show/${id}/${newPane}`);
  }

  render() {
    const { id, pane } = this.props.match.params;
    const activePane = pane || 'details';
    return (
      <PageHeaderWrapper
        title={
          <React.Fragment>
            <Button
              type="primary"
              style={{ float: 'right', marginLeft: '20px' }}
              onClick={() => {
                router.push(`/tasks/t/edit/${id}`);
              }}
            >
              <Icon type="setting" /> 配置
            </Button>
            <Button
              style={{ float: 'right' }}
              onClick={() => {
                this.setState({ updating: true });
              }}
            >
              <Icon type="edit" /> 编辑
            </Button>
            <div>任务详细</div>
          </React.Fragment>
        }
        content={
          <Menu onClick={e => this.navigate(e.key)} selectedKeys={[activePane]} mode="horizontal">
            <Menu.Item key="details">任务信息</Menu.Item>
            <Menu.Item key="jobs">作业记录</Menu.Item>
          </Menu>
        }
      >
        <Card style={{ margin: '-20px' }}>
          {activePane === 'details' && <TaskDetails id={id} />}
          {activePane === 'jobs' && <TaskJobs id={id} />}
        </Card>
        {this.state.updating && (
          <UpdateTaskInfo
            task={this.props.task}
            onCancel={() => this.setState({ updating: false })}
            onOk={() => {
              this.reload();
              this.setState({ updating: false });
            }}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default TaskIndex;
