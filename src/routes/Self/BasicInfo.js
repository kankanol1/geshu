import React from 'react';
import { Tabs, Card, Form, Input, Button, Spin } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ users, loading }) => ({
  users,
  loading: loading.models.users,
}))
@Form.create()
export default class BasicInfo extends React.PureComponent {
  componentWillMount() {
    const { users, dispatch } = this.props;
    dispatch({
      type: 'users/queryCurrentUser',
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { form, dispatch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'users/updateUser',
          payload: {
            ...fieldsValue,
          },
        });
      }
    });
  }

  render() {
    const { form, users, loading } = this.props;
    const currentRecord = users.currentUser;
    if (currentRecord === undefined || loading) {
      return <Spin />;
    }
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="用户名"
        >
          {
          form.getFieldDecorator('userName', {
            })(
              <span>{currentRecord.userName}</span>
            )
          }
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="角色"
        >
          {
          form.getFieldDecorator('role', {
            })(
              <span>{currentRecord.role}</span>
            )
          }
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="邮箱"
        >
          {form.getFieldDecorator('email', {
                rules: [{ required: true, message: '邮箱不能为空' },
                { message: '邮箱格式错误', type: 'email' }],
                initialValue: currentRecord.email,
              })(
                <Input placeholder="请输入" />
              )}
        </FormItem>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">提交</Button>
          <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>重置</Button>
        </div>
      </Form>
    );
  }
}
