import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Popconfirm,
  Tag,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Radio,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ users, loading }, { match }) => ({
  users,
  match,
  loading: loading.models.users,
}))
@Form.create()
class UserEdit extends PureComponent {
  handleAdd = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'users/createUser',
          payload: {
            ...fieldsValue,
          },
        });
      }
    });
  };

  handleUpdate = e => {
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
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'users/resetValidation',
    });
  };

  handlePasswordValidation = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback('两次密码输入不一致');
    }
    callback();
  };

  validateUserName = (rule, value, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/queryUserName',
      payload: {
        userName: value,
      },
    });
    callback();
  };

  render() {
    const { form, match, users } = this.props;
    const currentRecord = users.selectedUser;
    const updateMode = currentRecord && currentRecord.userName === match.params.userName;
    return (
      <PageHeaderLayout>
        <Form onSubmit={updateMode ? this.handleUpdate : this.handleAdd}>
          <Card>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="用户名"
              hasFeedback
              validateStatus={
                users.validate.userName.validating
                  ? 'validating'
                  : users.validate.userName.success
                    ? 'success'
                    : 'error'
              }
              help={
                users.validate.userName.validating ? '检查中...' : users.validate.userName.message
              }
            >
              {updateMode
                ? form.getFieldDecorator('userName', {
                    initialValue: currentRecord.userName,
                  })(<Input placeholder="请输入" disabled={updateMode} />)
                : form.getFieldDecorator('userName', {
                    rules: [
                      {
                        required: true,
                        message: '用户名称不能为空',
                      },
                      {
                        validator: this.validateUserName,
                        message: '用户名已存在',
                      },
                    ],
                    initialValue: !updateMode ? '' : currentRecord.userName,
                  })(<Input placeholder="请输入" disabled={updateMode} />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱" hasFeedback>
              {form.getFieldDecorator('email', {
                rules: [
                  { required: true, message: '邮箱不能为空' },
                  { message: '邮箱格式错误', type: 'email' },
                ],
                initialValue: !updateMode ? '' : currentRecord.email,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
              {form.getFieldDecorator('role', {
                initialValue: !updateMode ? 'user' : currentRecord.role,
              })(
                <RadioGroup>
                  <Radio value="user">普通用户</Radio>
                  <Radio value="admin">超级管理员</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码" hasFeedback>
              {form.getFieldDecorator('password', {
                rules: updateMode ? [] : [{ required: true, message: '密码不能为空' }],
              })(<Input placeholder="请输入" type="password" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} hasFeedback label="重复密码">
              {form.getFieldDecorator('password1', {
                rules: updateMode
                  ? [
                      {
                        message: '两次密码不一致',
                        validator: this.handlePasswordValidation,
                      },
                    ]
                  : [
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
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </div>
          </Card>
        </Form>
      </PageHeaderLayout>
    );
  }
}

export default UserEdit;
