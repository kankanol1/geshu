import React from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { Modal, Form, Input, Button, message } from 'antd';
import { createTask } from '@/services/dclient/taskAPI';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class CreateTask extends React.Component {
  state = {
    submitting: false,
  };

  handleSubmit(e) {
    e.preventDefault();
    const { form, onDismiss } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({ submitting: true });
      createTask({ ...fieldsValue, templateId: this.props.template }).then(response => {
        this.setState({ submitting: false }, () => {
          if (response && response.success) {
            message.info('创建完毕，开始配置');
            router.push(`/tasks/t/create/${response.id}`);
          } else {
            message.info((response && response.message) || '创建失败');
          }
        });
        if (onDismiss) onDismiss();
      });
    });
  }

  render() {
    const { form, onDismiss } = this.props;
    const { submitting } = this.state;
    return (
      <Modal
        title="新建任务"
        visible
        onOk={e => this.handleSubmit(e)}
        onCancel={e => {
          if (onDismiss) onDismiss();
        }}
      >
        <Form onSubmit={e => this.handleSubmit(e)}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请填写任务名称' }],
            })(<Input placeholder="任务名称" disabled={submitting} />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
            {form.getFieldDecorator('description', {
              // rules: [{ required: true, message: '请填写项目描述' }],
            })(<TextArea placeholder="任务描述" rows={3} disabled={submitting} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default CreateTask;
