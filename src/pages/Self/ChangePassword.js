import React from 'react';
import { Tabs, Card, Form, Input, Button } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ self, loading }) => ({
  self,
  loading: loading.models.self,
}))
@Form.create()
class ChangePassword extends React.PureComponent {
  handlePasswordValidation = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback('两次密码输入不一致');
    }
    callback();
  };

  handleSubmit = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (!err) {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'self/updatePassword',
            payload: {
              ...fieldsValue,
            },
            resolve,
            reject,
          });
        }).then(() => {
          form.resetFields();
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="当前密码" hasFeedback>
          {form.getFieldDecorator('oldPassword', {
            rules: [{ required: true, message: '密码不能为空' }],
          })(<Input placeholder="请输入" type="password" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码" hasFeedback>
          {form.getFieldDecorator('password', {
            rules: [{ required: true, message: '密码不能为空' }],
          })(<Input placeholder="请输入" type="password" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} hasFeedback label="重复密码">
          {form.getFieldDecorator('password1', {
            rules: [
              {
                required: true,
                message: '重复密码不能为空',
              },
              {
                message: '两次密码不一致',
                validator: this.handlePasswordValidation,
              },
            ],
          })(<Input placeholder="请输入" type="password" />)}
        </FormItem>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
            重置
          </Button>
        </div>
      </Form>
    );
  }
}

export default ChangePassword;
