import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Icon, Select, Collapse } from 'antd';
import BaseDataSettingsForm from './BaseDataSettingsForm';

const FormItem = Form.Item;
const { Option } = Select;
const { Panel } = Collapse;

export default class BarChartSettingsForm extends BaseDataSettingsForm {

}

BarChartSettingsForm.propTypes = {
  initialValue: PropTypes.object,
};
