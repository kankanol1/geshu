import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Popconfirm, Tag, Row, Col, Card, Form, Input, Select, Radio, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './UserList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;


const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ users, loading }, { match }) => ({
  users,
  match,
  loading: loading.models.users,
}))
@Form.create()
export default class UserList extends PureComponent {
  handleAdd = (e) => {
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
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  handlePasswordValidation = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback('两次密码输入不一致');
    }
    callback();
  }

  validateUserName = (rule, value, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/queryUserName',
      payload: {
        userName: value,
      },
    });
    callback();
  }

  render() {
    const currentRecord = undefined;
    const { form, match, users } = this.props;
    return (
      <PageHeaderLayout>
        <Form onSubmit={this.handleAdd}>
          <Card>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="用户名"
              hasFeedback
              validateStatus={users.validate.userName.validating ? 'validating' :
                (users.validate.userName.success ? 'success' : 'error')}
              help={users.validate.userName.validating ? '检查中...' : users.validate.userName.message}
            >
              {form.getFieldDecorator('userName', {
                rules: [{ required: true,
                  message: '用户名称',
                  validator: this.validateUserName,
              }],
                initialValue: currentRecord === undefined ? '' : currentRecord.name,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="邮箱"
              hasFeedback
            >
              {form.getFieldDecorator('email', {
                rules: [{ required: true, message: '邮箱格式: xxx@xxx.xx', type: 'email' }],
                initialValue: currentRecord === undefined ? '' : currentRecord.description,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="角色"
            >
              {form.getFieldDecorator('role', {
                initialValue: currentRecord === undefined ? 'user' : currentRecord.labels,
              })(
                <RadioGroup>
                  <Radio value="user">普通用户</Radio>
                  <Radio value="admin">超级管理员</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="密码"
              hasFeedback
            >
              {form.getFieldDecorator('password', {
                rules: [{ required: true, message: '密码' }],
                initialValue: currentRecord === undefined ? [] : currentRecord.labels,
              })(
                <Input placeholder="请输入" type="password" />
              )}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              hasFeedback
              label="重复密码"
            >
              {form.getFieldDecorator('password1', {
                rules: [{ required: true,
                  message: '再重复一次密码',
                  validator: this.handlePasswordValidation,
                }],
                initialValue: currentRecord === undefined ? [] : currentRecord.labels,
              })(
                <Input placeholder="请输入" type="password" />
              )}
            </FormItem>
            <div style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">提交</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </div>
          </Card>
        </Form>
      </PageHeaderLayout>
    );
  }
}
