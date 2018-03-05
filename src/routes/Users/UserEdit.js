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

@connect(({ users, loading }) => ({
  users,
  loading: loading.models.users,
}))
@Form.create()
export default class UserList extends PureComponent {
  handleAdd = (e) => {
    e.preventDefault();

    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        console.log('Received values of form: ', fieldsValue);
      }
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const currentRecord = undefined;
    const { form } = this.props;
    return (
      <PageHeaderLayout>
        <Form onSubmit={this.handleAdd}>
          <Card>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="用户名"
            >
              {form.getFieldDecorator('userName', {
                rules: [{ required: true, message: '用户名称' }],
                initialValue: currentRecord === undefined ? '' : currentRecord.name,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="邮箱"
            >
              {form.getFieldDecorator('email', {
                rules: [{ required: true, message: '邮箱' }],
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
              label="重复密码"
            >
              {form.getFieldDecorator('password1', {
                rules: [{ required: true, message: '重复密码' }],
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
