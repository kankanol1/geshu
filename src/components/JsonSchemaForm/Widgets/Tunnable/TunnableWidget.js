import React from 'react';
import { Row, Col, Select, Switch, Icon } from 'antd';

export default class TunnableWidget extends React.Component {
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

  onPropertyChange(name, value) {
    const newData = { ...this.state.formData, [name]: value };
    const dataCopy = { ...newData };
    if (dataCopy.tunableValue === undefined) {
      dataCopy.tunableValue = [];
    }
    if (dataCopy.value === undefined) {
      dataCopy.value = -1;
    }
    this.setState({
      formData: dataCopy,
    }, () => {
      this.props.onChange(dataCopy);
    });
  }

  renderSchema(name, extraProps = {}) {
    const { registry, schema, idSchema, formData, uiSchema,
      errorSchema, onBlur, onFocus, disabled, readonly } = this.props;
    const { fields } = registry;
    const { SchemaField } = fields;
    return (
      <SchemaField
        key={name}
        name={name}
        required={false}
        schema={schema.properties[name]}
        uiSchema={uiSchema[name]}
        errorSchema={errorSchema[name]}
        idSchema={idSchema[name]}
        formData={formData[name]}
        onChange={value => this.onPropertyChange(name, value)}
        onBlur={onBlur}
        onFocus={onFocus}
        registry={registry}
        disabled={disabled}
        readonly={readonly}
        {...extraProps}
      />
    );
  }

  renderTunableTypes() {
    return (
      <Row>
        <Col span={8}><legend> {this.props.schema.properties.tunableType.description} {'*'} </legend></Col>
        <Col span={16}>
          <Select
            placeholder="请选择"
            onChange={e => this.onPropertyChange('tunableType', e)}
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
        <div >
          <Row>
            <Col span={18} >
              <TitleField title={displayTitle} />
            </Col>
            <Col span={6}>
              <div style={{ lineHeight: '35px' }}>
                <Switch
                  onChange={v => this.onPropertyChange('tunableType', v ? 'GRID' : 'FIXED')}
                  checkedChildren="可调节"
                  unCheckedChildren="固定值"
                  defaultChecked={tunableType !== 'FIXED'}
                />
              </div>
            </Col>
          </Row>
        </div>
        {tunableType && tunableType !== 'FIXED' ?
          (
            <React.Fragment>
              {this.renderTunableTypes()} {this.renderSchema('tunableValue')}
            </React.Fragment>
          ) : this.renderSchema('value')}
      </div>
    );
  }
}
