import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { updateTask } from '@/services/dclient/taskAPI';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class UpdateTaskInfo extends React.Component {
  state = {
    submitting: false,
  };

  handleSubmit(e) {
    e.preventDefault();
    const { form, onOk, task } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({ submitting: true });
      updateTask({ ...fieldsValue, id: task.id }).then(response => {
        this.setState({ submitting: false }, () => {
          if (response && response.success) {
            message.info('更新完毕');
            onOk();
          } else {
            message.info((response && response.message) || '更新失败');
          }
        });
      });
    });
  }

  render() {
    const { form, task, onCancel } = this.props;
    const { submitting } = this.state;
    return (
      <Modal
        title="更新任务信息"
        visible
        closable={!submitting}
        destroyOnClose
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel} disabled={submitting}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={e => this.handleSubmit(e)}
          >
            确定
          </Button>,
        ]}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请填写项目名称' }],
            initialValue: task.name,
          })(<Input placeholder="请输入" disabled={submitting} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
          {form.getFieldDecorator('description', {
            rules: [{ required: true, message: '请填写项目描述' }],
            initialValue: task.description,
          })(<TextArea placeholder="请输入" rows={3} disabled={submitting} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default UpdateTaskInfo;
