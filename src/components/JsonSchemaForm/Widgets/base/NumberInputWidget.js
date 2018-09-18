import React from 'react';
import { Modal, Button, Row, Col, InputNumber } from 'antd';

const NumberInputWidget = (props) => {
  const { required, onChange, formData, uiSchema, schema } = props;
  const { description } = schema;
  const options = uiSchema ? uiSchema['ui:options'] : {};
  const { min, max, step } = options;
  return (
    <Row>
      <Col span={8}><legend> {description} {required ? '*' : null}</legend></Col>
      <Col span={16}>
        <InputNumber
          min={min}
          max={max}
          step={step}
          onChange={v => onChange(v)}
          value={formData}
          style={{
              width: '100%',
            }}
        />
      </Col>
    </Row>
  );
};

export default NumberInputWidget;
