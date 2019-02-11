import React from 'react';
import { Steps, Card, Button } from 'antd';
import Link from 'umi/link';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditTaskStepDataSource from './EditTaskStepDataSource';
import EditTaskStepDataSourceCheck from './EditTaskStepDataSourceCheck';
import EditTaskStepDataSink from './EditTaskStepDataSink';
import EditTaskStepDone from './EditTaskStepDone';
import styles from './EditTask.less';

const { Step } = Steps;

const stepsRender = [
  EditTaskStepDataSource,
  EditTaskStepDataSourceCheck,
  EditTaskStepDataSink,
  EditTaskStepDone,
];

class EditTask extends React.Component {
  render() {
    const { id, mode, pane } = this.props.match.params;
    const activePane = pane ? parseInt(pane, 10) : 0;
    const StepComp = stepsRender[activePane];
    return (
      <PageHeaderWrapper
        title="配置任务"
        content={
          <Steps current={activePane} size="small">
            <Step title="数据源" description="指定任务的输入数据" />
            <Step title="核对" description="核对并验证数据格式" />
            <Step title="数据输出" description="指定任务的数据输出" />
            <Step title="完成" description="配置完毕" />
          </Steps>
        }
      >
        <Card>
          <div className={styles.topBtns}>
            <Link to={`/tasks/t/show/${id}`}>
              <Button> &lt;&nbsp; 返回</Button>
            </Link>
          </div>
          <StepComp mode={mode} id={id} pane={activePane} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default EditTask;
