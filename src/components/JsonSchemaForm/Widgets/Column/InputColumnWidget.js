

import React from 'react';
import { Tag, Icon, Row, Col } from 'antd';
import SelectWidget from '../base/SelectWidget';
import { callFuncElseError } from '../../utils';

export default class InputColumnWidget extends React.PureComponent {
  render() {
    const { getField } = this.props.uiSchema['ui:options'];
    const { result, error } = callFuncElseError(getField);
    const schema = result;
    if (schema) {
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
            <React.Fragment>
              <p style={{ color: 'red', display: 'inline-block', paddingRight: '20px' }}>{error.message}</p>
            </React.Fragment>
          </Col>
        </Row>
      );
    }
  }
}
