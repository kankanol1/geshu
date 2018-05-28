
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Icon, Checkbox } from 'antd';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

@Form.create()
export default class DisplaySettingsForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={e => this.handleSubmit(e)} layout="horizontal">
        <FormItem label="图表高度" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('height', {
            rules: [{
              required: true, message: '请输入数据库名',
            }],
            initialValue: 400,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="显示x轴" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('enablex', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox />
          )}
        </FormItem>
        <FormItem label="x轴别名" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('xalias', {
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="显示Y轴" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('enabley', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox />
          )}
        </FormItem>
        <FormItem label="Y轴别名" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('yalias', {
          })(
            <Input />
          )}
        </FormItem>
      </Form>);
  }
}


// DisplaySettingsForm.propTypes = {
//   initialValue: PropTypes.object,
// };
