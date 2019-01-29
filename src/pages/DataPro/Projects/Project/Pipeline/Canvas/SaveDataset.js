import React from 'react';
import { Modal, Form, Input, Icon, Table, Spin, message } from 'antd';

import { createDataset } from '@/services/datapro/datasetAPI';

@Form.create()
class SaveDataset extends React.Component {
  state = {
    loading: false,
  };

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const { dataset, projectId, onDismiss } = this.props;
        // submit.
        this.setState({ loading: true });
        createDataset({
          projectId,
          id: dataset.id,
          ...fieldsValue,
        }).then(response => {
          this.setState({ loading: false });
          if (response && response.success) {
            message.info('添加成功');
            onDismiss();
          } else {
            message.error(response.message || '添加失败');
          }
        });
      }
    });
  }

  render() {
    const { dataset, onDismiss, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={`存储数据集:${dataset.name}[${dataset.id}]`}
        visible
        closable
        destroyOnClose
        onCancel={onDismiss}
        onOk={e => this.handleSubmit(e)}
        width={600}
        okButtonProps={{ loading: this.state.loading }}
        cancelButtonDisabled={this.state.loading}
      >
        <Form.Item label="名称" labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入名称' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="描述" labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
          {getFieldDecorator('description', {})(<Input.TextArea rows={4} />)}
        </Form.Item>
      </Modal>
    );
  }
}

export default SaveDataset;
