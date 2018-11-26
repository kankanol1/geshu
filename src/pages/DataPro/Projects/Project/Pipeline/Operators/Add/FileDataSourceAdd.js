import React from 'react';
import { Steps, Card, Button } from 'antd';
import router from 'umi/router';

import { addSourceOperator } from '@/services/datapro/pipelineAPI';

const { Step } = Steps;

let count = 0;

class FileDataSourceAdd extends React.Component {
  state = {
    current: 0,
    // fileId: -1,
  };

  handleSubmit = () => {
    const { id } = this.props;
    // request.
    count++;
    addSourceOperator({
      projectId: this.props.id,
      type: 'FileDataSource',
      input: [],
      output: [`name${count}`],
    }).then(response => {
      router.push(`/projects/p/pipeline/${id}`);
    });
  };

  renderUpload = () => {
    return (
      <Button type="primary" onClick={() => this.handleSubmit()}>
        submit
      </Button>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Card>
          <Steps progressDot current={0} size="small">
            <Step title="上传文件" />
            <Step title="核对字段" />
            <Step title="完成" />
          </Steps>
          {this.state.current === 0 && this.renderUpload()}
          {this.state.current === 1 && this.renderSchema()}
          {this.state.current === 2 && this.renderFinish()}
        </Card>
      </React.Fragment>
    );
  }
}

export default FileDataSourceAdd;
