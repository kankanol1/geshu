import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';

class EditTaskStepDataSourceCheck extends React.Component {
  render() {
    const { mode, id, pane } = this.props;
    return (
      <div>
        <Button type="primary" onClick={() => router.push(`/tasks/t/${mode}/${id}/${pane - 1}`)}>
          &lt;上一步
        </Button>
        此处显示数据源验证结果
        <Button type="primary" onClick={() => router.push(`/tasks/t/${mode}/${id}/${pane + 1}`)}>
          下一步 &gt;
        </Button>
      </div>
    );
  }
}

export default EditTaskStepDataSourceCheck;
