import React from 'react';
import { Slider, InputNumber, Icon, Row, Col } from 'antd';

export default class RandomSplitWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    const value = props.formData.firstWeight.value || 0.5;
    this.state = {
      value,
    };
  }

  componentWillReceiveProps(props) {
    const value = props.formData.firstWeight.value || 0.5;
    if (props.formData.firstWeight.value) {
      this.setState({
        value,
      });
    } else {
      this.handleValueChange(0.5);
    }
  }

  handleValueChange(v) {
    let nv = parseFloat(v);
    if (isNaN(nv)) nv = 0.0;
    if (nv > 1) nv = 1;
    this.setState({ value: nv }, () => {
      this.props.onChange({ firstWeight: { value: nv },
        secondWeight: { value: parseFloat((1 - nv).toFixed(2)) } }
      );
    });
  }

  handleSecondValueChange(v) {
    let nv = parseFloat(v);
    if (isNaN(nv)) nv = 0.0;
    if (nv > 1) nv = 1;
    this.handleValueChange(1 - nv);
  }

  render() {
    const { required } = this.props;
    // const { description } = this.props.schema;
    return (
      <Row>
        <Col span={8}><legend> {'分割比'} {required ? '*' : null}</legend></Col>
        <Col span={4}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={1}
            step={0.01}
            value={this.state.value}
            onChange={v => this.handleValueChange(v)}
          />
        </Col>
        <Col span={8}>
          <Slider
            min={0}
            max={1}
            step={0.01}
            onChange={v => this.handleValueChange(v)}
            value={this.state.value}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={1}
            step={0.01}
            value={(1 - this.state.value).toFixed(2)}
            onChange={v => this.handleSecondValueChange(v)}
          />
        </Col>
      </Row>
    );
  }
}
