import React from 'react';
import { Button, Modal, message } from 'antd';
import { deleteProjectById } from '@/services/datapro/projectsAPI';
import router from 'umi/router';

class ProjectSettings extends React.PureComponent {
  render() {
    const { id } = this.props;
    return (
      <Button
        type="danger"
        onClick={() => {
          Modal.confirm({
            title: '确认删除吗？',
            content: '注意：此操作不可恢复',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              deleteProjectById({ id }).then(response => {
                if (response && response.success) {
                  message.info('删除完毕');
                  // redirect to projects list.
                  router.push('/projects/list');
                } else {
                  message.error((response && response.message) || '删除失败！');
                }
              });
            },
          });
        }}
      >
        删除项目
      </Button>
    );
  }
}

export default ProjectSettings;
