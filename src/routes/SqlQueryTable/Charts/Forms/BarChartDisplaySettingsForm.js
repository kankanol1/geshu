import React, { Component } from 'react';
import { Form, Input, Button, Icon, Checkbox } from 'antd';
import BaseDisplaySettingsForm from './BaseDisplaySettingsForm';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

export default class BarChartDisplaySettingsForm extends BaseDisplaySettingsForm {
  renderExtraItems() {
    const { getFieldDecorator } = this.props.form;
    const { initialValue } = this.props;
    return (
      <FormItem label="纵向布局" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        {getFieldDecorator('transpose', {
            valuePropName: 'checked',
            initialValue: initialValue.transpose,
          })(
            <Checkbox />
          )}
      </FormItem>
    );
  }
}
