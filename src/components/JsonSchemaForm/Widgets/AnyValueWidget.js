import React from 'react';
import { Row, Col, Input } from 'antd';

const AnyValueWidget = (props) => {
  const { schema, formData } = props;
  const value = formData.value === {} ? '' : formData.value;
  return (
    <Row>
      <Col span={8}><legend>{schema.description}</legend></Col>
      <Col span={16}>
        {/* <Input value={value} onChange={v => props.onChange({ value: v })} /> */}
        Not supported operation.
      </Col>
    </Row>
  );
};

export default AnyValueWidget;
