

import React from 'react';
import { Row, Col } from 'antd';
import { TextWidget } from 'react-jsonschema-form/lib/components/widgets';
import NumberInputWidget from '../base/NumberInputWidget';
import CompositeWidget from '../CompositWidget';

const typeConfig = {
  date: TextWidget,
  long: NumberInputWidget,
  int: NumberInputWidget,
  float: NumberInputWidget,
  string: TextWidget,
  decimal: NumberInputWidget,
  double: NumberInputWidget,
  short: NumberInputWidget,
  timestamp: TextWidget,
  boolean: TextWidget,
  byte: TextWidget,
};

const parseNumber = v => v && v.replace(/[^0-9.]+/, '');
const parseInt = v => v && v.replace(/[^0-9]+/, '');

const valueConverter = {
  date: v => v,
  long: parseInt,
  int: parseInt,
  float: parseNumber,
  string: v => v,
  decimal: parseNumber,
  double: parseNumber,
  short: parseInt,
  timestamp: v => v,
  boolean: v => v,
  byte: v => v,
};

export default class ValueTypePairWidget extends CompositeWidget {
  onPropertyChanged(name, value) {
    // check value for `value` field.
    const { fieldType, value: vValue } = this.state.formData;
    let type = fieldType;
    let oldV = vValue;
    const extraV = {};
    if (fieldType) {
      if (name === 'fieldType') {
        // use new value as fieldType.
        type = value;
      } else if (name === 'value') {
        oldV = `${value}`;
        extraV.value = oldV;
      }
    }
    if (type) {
      // parse new value.
      const newV = valueConverter[`${type}`](oldV);
      if (newV !== oldV) {
        extraV.value = newV;
      }
    }
    const dataCopy = Object.assign({}, { ...this.state.formData, [name]: value, ...extraV });
    this.onFormDataChanged(dataCopy);
  }

  render() {
    const { fieldType } = this.props.formData;
    return (
      <React.Fragment>
        {this.renderSchema('fieldType', {}, {}, undefined, { description: '类型' })}
        {fieldType
          ? this.renderSchema('value', {}, {}, typeConfig[fieldType], { description: '值' })
          : (
            <Row>
              <Col span={8}>值 *</Col>
              <Col span={16}> <span style={{ color: 'red' }}>请先选择类型</span> </Col>
            </Row>
          )
        }
      </React.Fragment>
    );
  }
}
