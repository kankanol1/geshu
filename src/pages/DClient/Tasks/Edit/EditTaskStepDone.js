import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';

class EditTaskStepDataSinkCheck extends React.Component {
  render() {
    const { mode, id, pane } = this.props;
    return (
      <div>
        <Button type="primary" onClick={() => router.push(`/tasks/t/${mode}/${id}/${pane - 1}`)}>
          &lt;上一步
        </Button>
        <div>结束</div>
        <Button type="primary" onClick={() => router.push(`/tasks/t/${mode}/${id}/${pane + 1}`)}>
          运行 &gt;
        </Button>
      </div>
    );
  }
}

export default EditTaskStepDataSinkCheck;
