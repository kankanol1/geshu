import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Icon, Checkbox } from 'antd';
import DisplaySettingsForm from './DisplaySettingsForm';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

export default class BarChartDisplaySettingsForm extends DisplaySettingsForm {
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
