/**
 * the basic display for param input
 * */

import React from 'react';
import { Input, Row, Col } from 'antd';

export default class BasicParamInput extends React.PureComponent {
  render() {
    // name, validator, type, tip
    const { title, name } = this.props;

    return (
      <div>
        <Row>
          <Col span={6}>
            <span style={{ lineHeight: '32px' }}>{title === undefined ? name : title}</span>
          </Col>
          <Col span={18}> <Input placeholder={name} /> </Col>
        </Row>
      </div>
    );
  }
}
