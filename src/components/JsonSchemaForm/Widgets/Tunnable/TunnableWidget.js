import React from 'react';
import { Row, Col, Select, Switch, Icon } from 'antd';
import CompositeWidget from '../CompositWidget';

export default class TunnableWidget extends CompositeWidget {
  constructor(props) {
    super(props);
    const extra = {};
    if (props.formData.tunableType === undefined) {
      extra.tunableType = 'FIXED';
      this.props.onChange({ ...props.formData, ...extra });
    }
    this.state = {
      formData: { ...props.formData, ...extra },
    };
  }

  onPropertyChanged(name, value) {
    const newData = { ...this.state.formData, [name]: value };
    const dataCopy = { ...newData };
    if (dataCopy.tunableValue === undefined) {
      dataCopy.tunableValue = [];
    }
    if (dataCopy.value === undefined) {
      dataCopy.value = 0;
    }
    this.onFormDataChanged(dataCopy);
  }

  renderTunableTypes() {
    return (
      <Row>
        <Col span={8}>
          <legend>
            {' '}
            {this.props.schema.properties.tunableType.description}
            {' '}
            {'*'}
            {' '}
          </legend>

        </Col>
        <Col span={16}>
          <Select
            placeholder="请选择"
            onChange={e => this.onPropertyChanged('tunableType', e)}
            value={this.state.formData.tunableType}
          >
            <Select.Option value="GRID">GRID</Select.Option>
            <Select.Option value="RANGE">RANGE</Select.Option>
          </Select>
        </Col>
      </Row>
    );
  }

  render() {
    const { required, properties, schema, idSchema, registry } = this.props;

    const { TitleField } = registry.fields;
    const { title, description } = schema;
    let displayTitle = description === undefined ? title : description;
    if (required) {
      displayTitle += ' *';
    }
    const { tunableType } = this.state.formData;
    return (
      <div>
        <div>
          <Row>
            <Col span={18}>
              <TitleField title={displayTitle} />
            </Col>
            <Col span={6}>
              <div style={{ lineHeight: '35px' }}>
                <Switch
                  onChange={v => this.onPropertyChanged('tunableType', v ? 'GRID' : 'FIXED')}
                  checkedChildren="可调节"
                  unCheckedChildren="固定值"
                  defaultChecked={tunableType !== 'FIXED'}
                />
              </div>
            </Col>
          </Row>
        </div>
        {tunableType && tunableType !== 'FIXED'
          ? (
            <React.Fragment>
              {this.renderTunableTypes()}
              {' '}
              {this.renderSchema('tunableValue')}
            </React.Fragment>
          ) : this.renderSchema('value')}
      </div>
    );
  }
}
