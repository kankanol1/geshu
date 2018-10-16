import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Icon, Checkbox } from 'antd';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

export default class BaseDisplaySettingsForm extends Component {
  static defaultProps = {
    initialValue: {
      height: 400,
      enablex: true,
      enabley: true,
    },
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { initialValue } = this.props;
    return (
      <Form onSubmit={e => this.handleSubmit(e)} layout="horizontal">
        <FormItem label="图表高度" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('height', {
            rules: [
              {
                required: true,
                message: '请输入数据库名',
              },
            ],
            initialValue: initialValue.height,
          })(<Input />)}
        </FormItem>
        <FormItem label="显示x轴" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('enablex', {
            valuePropName: 'checked',
            initialValue: initialValue.enablex,
          })(<Checkbox />)}
        </FormItem>
        <FormItem label="x轴别名" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('xalias', {
            initialValue: initialValue.xalias,
          })(<Input />)}
        </FormItem>
        <FormItem label="显示Y轴" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('enabley', {
            valuePropName: 'checked',
            initialValue: initialValue.enabley,
          })(<Checkbox />)}
        </FormItem>
        <FormItem label="Y轴别名" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('yalias', {
            initialValue: initialValue.yalias,
          })(<Input />)}
        </FormItem>
        {this.renderExtraItems()}
      </Form>
    );
  }
}

BaseDisplaySettingsForm.propTypes = {
  initialValue: PropTypes.object,
};
