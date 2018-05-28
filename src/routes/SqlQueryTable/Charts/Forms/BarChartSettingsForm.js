import React, { Component } from 'react';
import { Form, Input, Button, Icon, Select } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
export default class BarChartSettingsForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={e => this.handleSubmit(e)} layout="horizontal">
        <FormItem label="数据库" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('table', {
            rules: [{
              required: true, message: '请输入数据库名',
            }],
            initialValue: 'whatever',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="X轴" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('xsource', {
            rules: [{
              required: true, message: '请设置X轴',
            }],
            initialValue: 'year',
          })(
            <Select>
              <Option value="year">year</Option>
              <Option value="sales">sales</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="Y轴" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('ysource', {
            rules: [{
              required: true, message: '请设置Y轴',
            }],
            initialValue: 'sales',
          })(
            <Select>
              <Option value="year">year</Option>
              <Option value="sales">sales</Option>
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

// BarChartSettingsForm.propTypes = {
//   initialValue: PropTypes.object,
// };
