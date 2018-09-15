

import React from 'react';
import { Tag, Icon, Row, Col, Input, InputNumber } from 'antd';
import SelectWidget from '../SelectWidget';
import RelationFieldWidget from '../RelationFieldWidget';

const typeConfig = {
  date: 'string',
  long: 'integer',
  int: 'integer',
  float: 'string',
  string: 'string',
  decimal: 'string',
  double: 'string',
  short: 'string',
  timestamp: 'string',
  boolean: 'string',
  byte: 'string',
};
export default class ValueTypePairWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: { ...props.formData },
    };
  }
  onPropertyChange(name, value) {
    const dataCopy = Object.assign({}, { ...this.state.formData, [name]: value });
    this.setState({
      formData: dataCopy,
    }, () => this.props.onChange(dataCopy));
  }
  render() {
    const { fields } = this.props.uiSchema['ui:options'] || { fields: [] };
    const { fieldType, value } = this.state.formData;
    return (
      <Row>
        <Col span={24}>
          <SelectWidget
            {...this.props}
            value={fieldType}
            options={{ enumOptions: fields.map((i) => { return { label: i, value: i }; }) }}
            onChange={v => (this.onPropertyChange('fieldType', v))}
          />
        </Col>
        <Col span={8}>值 *</Col>
        <Col span={16}>
          <RelationFieldWidget
            {...this.props}
            type={typeConfig[fieldType]}
            value={value}
            onChange={v => (this.onPropertyChange('value', v))}
          />
        </Col>
      </Row>
    );
  }
}
