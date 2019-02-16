import React from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Form, Input, Button, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({ submitting: true });
      createTask({ ...fieldsValue }).then(response => {
        this.setState({ submitting: false }, () => {
          if (response && response.success) {
            message.info('创建完毕，开始配置');
            router.push(`/tasks/t/create/${response.id}`);
          } else {
            message.info((response && response.message) || '创建失败');
          }
        });
      });
    });
  }

  render() {
    const { form } = this.props;
    const { submitting } = this.state;
    return (
      <PageHeaderWrapper title="新建任务">
        <Card>
          <Link to="/tasks/list">
            <Button> &lt;&nbsp; 返回</Button>
          </Link>
          <Form onSubmit={e => this.handleSubmit(e)}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请填写项目名称' }],
              })(<Input placeholder="请输入" disabled={submitting} />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
              {form.getFieldDecorator('description', {
                rules: [{ required: true, message: '请填写项目描述' }],
              })(<TextArea placeholder="请输入" rows={3} disabled={submitting} />)}
            </FormItem>
            <div style={{ textAlign: 'center' }}>
              <Button type="primary" loading={submitting} htmlType="submit">
                创建
              </Button>
            </div>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CreateTask;
