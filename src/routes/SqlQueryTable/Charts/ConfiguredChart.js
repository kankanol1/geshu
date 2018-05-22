import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';

export default class ConfiguredChart extends Component {
  state={

  }

  render() {
    return (
      <Row>
        <Col span={8}> <Card> {this.renderConfiguration()} </Card> </Col>
        <Col span={16}> {this.renderChart()} </Col>
      </Row>
    );
  }
}
