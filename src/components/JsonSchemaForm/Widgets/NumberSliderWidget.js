import React from 'react';
import { Modal, Button, Row, Col, Slider, InputNumber } from 'antd';

// TODO: Not finished.
export default class NumberSliderWidget extends React.PureComponent {
  state = {
    cacheValue: 0,
  }

  onChange = (value) => {
    this.setState({
      cacheValue: value,
    });
  }

  render() {
    const { required } = this.props;
    const { description } = this.props.schema;
    return (
      <Row>
        <Col span={8}><legend> {description} {required ? '*' : null}</legend></Col>
        <Col span={10}>
          <Slider defaultValue={30} onChange={this.onChange} value={this.state.cacheValue} />
        </Col>
        <Col span={6}>
          <InputNumber
            min={0}
            max={100}
            step={0.01}
            onChange={this.onChange}
            value={this.state.cacheValue}
          />
        </Col>
      </Row>
    );
  }
}
