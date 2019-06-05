import React from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'umi/link';
import { Card, Tabs, Button, Icon, Menu, Switch, Row, Col, message } from 'antd';
import { connect } from 'dva';
import XCronExp from '@/components/XCronExp';
import styles from './EditTask.less';
import { configTaskCron } from '@/services/dclient/taskAPI';

@connect(({ task, loading }) => ({
  task: task.data,
  loading: loading.models.task,
}))
class SetTimer extends React.Component {
  state = {
    enabled: false,
    expression: undefined,
  };

  componentDidMount() {
    this.reload();
  }

  componentWillReceiveProps(props) {
    // get task.
    const { task } = props;
    const { cronEnabled, cronExpression } = task;
    this.setState({
      enabled: cronEnabled,
      expression: cronExpression,
    });
  }

  handleSave(e) {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { enabled, expression } = this.state;
    this.setState({ saving: true });
    configTaskCron({
      id,
      enabled,
      expression,
    }).then(response => {
      if (response && response.success) {
        message.info(response.message);
      } else {
        message.error(`${(response && response.message) || '保存失败'}`);
      }
      this.setState({ saving: false });
    });
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

  render() {
    const { task } = this.props;
    const { id } = this.props.match.params;
    const { enabled, expression, saving } = this.state;
    return (
      <PageHeaderWrapper
        title={
          <div>
            {task.name}
            [设置定时任务]
          </div>
        }
      >
        <Card>
          <div className={styles.topBtns}>
            <Link to={`/tasks/t/show/${id}`}>
              <Button> &lt;&nbsp; 返回</Button>
            </Link>
          </div>
          <Row>
            <Col span={11} offset={11}>
              <Switch
                checked={enabled}
                checkedChildren="启用"
                unCheckedChildren="关闭"
                onChange={v => this.setState({ enabled: v })}
              />
            </Col>
          </Row>

          {enabled && (
            <XCronExp value={expression} onChange={v => this.setState({ expression: v })} />
          )}
          <Row style={{ marginTop: '20px' }}>
            <Col span={11} offset={11}>
              <Button loading={saving} type="primary" onClick={e => this.handleSave(e)}>
                保存
              </Button>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SetTimer;
