import React from 'react';
import { Col, Row } from 'antd';

const XFormError = props => {
  const { labelCol, wrapperCol, content } = props;
  return (
    <Row>
      <Col span={wrapperCol.span} offset={labelCol.span}>
        <span style={{ color: 'red' }}>{content}</span>
      </Col>
    </Row>
  );
};

export default XFormError;
