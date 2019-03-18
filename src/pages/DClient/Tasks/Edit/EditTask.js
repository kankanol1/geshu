import React from 'react';
import { Steps, Card, Button } from 'antd';
import Link from 'umi/link';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { queryTaskById } from '@/services/dclient/taskAPI';
import { getTemplateById } from '@/services/dclient/templateAPI';

import EditTaskStepDataSource from './EditTaskStepDataSource';
import EditTaskStepDataSourceCheck from './EditTaskStepDataSourceCheck';
import EditTaskStepDataSink from './EditTaskStepDataSink';
import EditTaskStepDone from './EditTaskStepDone';
import EditTaskStepChooseTemplate from './EditTaskStepChooseTemplates';
import styles from './EditTask.less';

const { Step } = Steps;

const stepsRender = [
  EditTaskStepChooseTemplate,
  EditTaskStepDataSource,
  EditTaskStepDataSourceCheck,
  EditTaskStepDataSink,
  EditTaskStepDone,
];

class EditTask extends React.PureComponent {
  state = {
    templateInfo: undefined,
  };

  componentDidMount() {
    this.loadTemplateInfo(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadTemplateInfo(props);
  }

  loadTemplateInfo(props) {
    const { id, pane } = props.match.params;
    queryTaskById({ id }).then(response => {
      if (response && response.templateId) {
        getTemplateById({ id: response.templateId }).then(res2 => {
          if (res2) {
            this.setState({ templateInfo: res2 });
          }
        });
      }
    });
  }

  render() {
    const { id, mode, pane } = this.props.match.params;
    const activePane = pane ? parseInt(pane, 10) : 0;
    const StepComp = stepsRender[activePane];
    const { templateInfo } = this.state;
    return (
      <PageHeaderWrapper
        title="配置任务"
        content={
          <Steps current={activePane} size="small">
            <Step title="选择模版" description="选择数据处理模版" />
            <Step title="数据源" description="指定任务的输入数据" />
            <Step title="核对" description="核对并验证数据格式" />
            <Step title="数据输出" description="指定任务的数据输出" />
            <Step title="完成" description="配置完毕" />
          </Steps>
        }
      >
        <Card>
          <div className={styles.topBtns}>
            <Link
              to={
                activePane === 0
                  ? `/tasks/t/show/${id}`
                  : `/tasks/t/${mode}/${id}/${activePane - 1}`
              }
            >
              <Button> &lt;&nbsp; 返回</Button>
            </Link>
          </div>
          <StepComp mode={mode} id={id} pane={activePane} templateInfo={templateInfo} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default EditTask;
