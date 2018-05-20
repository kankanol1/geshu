import React from 'react';
import { Modal, Button, Row, Col, InputNumber } from 'antd';

export default class NumberInputWidget extends React.PureComponent {
  render() {
    const { required, onChange, formData, uiSchema } = this.props;
    const { description } = this.props.schema;
    const { min, max, step } = uiSchema['ui:options'];
    return (
      <Row>
        <Col span={8}><legend> {description} {required ? '*' : null}</legend></Col>
        <Col span={16}>
          <InputNumber
            min={min}
            max={max}
            step={step}
            onChange={v => onChange({ value: v })}
            value={formData.value}
            style={{
              width: '100%',
            }}
          />
        </Col>
      </Row>
    );
  }
}
