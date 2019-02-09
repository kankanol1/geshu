import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';

class EditTaskStepDataSource extends React.Component {
  render() {
    const { mode, id, pane } = this.props;
    return (
      <div>
        初始化数据源
        <Button type="primary" onClick={() => router.push(`/tasks/t/${mode}/${id}/${pane + 1}`)}>
          下一步 &gt;
        </Button>
      </div>
    );
  }
}

export default EditTaskStepDataSource;
