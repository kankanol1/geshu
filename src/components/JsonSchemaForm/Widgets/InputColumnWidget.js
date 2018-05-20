

import React from 'react';
import { Modal, Button, Row, Col } from 'antd';
import SelectWidget from './SelectWidget';

export default class InputColumnWidget extends React.PureComponent {
  render() {
    const { getField } = this.props.uiSchema['ui:options'];
    let schema;
    let error;
    if (getField !== undefined) {
      try {
        schema = getField();
      } catch (err) {
        error = err;
      }
    } else {
      error = '未定义处理函数,请通过ui:option设置';
    }
    if (schema !== undefined) {
      return (
        <SelectWidget
          {...this.props}
          value={this.props.formData.value}
          options={{ enumOptions: schema.map((i) => { return { label: i, value: i }; }) }}
          onChange={(v) => { this.props.onChange({ value: v }); }}
        />
      );
    } else {
      const { required } = this.props;
      const { description } = this.props.schema;
      return (
        <Row>
          <Col span={8}><legend> {description} {required ? '*' : null}</legend></Col>
          <Col span={16}>
            <p style={{ color: 'red' }}>{error.message}</p>
          </Col>
        </Row>
      );
    }
  }
}
