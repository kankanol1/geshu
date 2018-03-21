import React from 'react';
import { Col, Row } from 'antd';
import styles from './SwitchSchemaWidget.less';

export default class SwitchSchemaWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: { ...props.formData },
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      formData: { ...props.formData },
    });
  }

  onPropertyChange(name, value) {
    const dataCopy = Object.assign({}, { ...this.state.formData, [name]: value });
    this.setState({
      formData: dataCopy,
    }, () => this.props.onChange(dataCopy));
  }

  isRequired(name) {
    const { schema } = this.props;
    return (
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
    );
  }

  renderSchema(name) {
    const { registry, schema, idSchema, formData, uiSchema,
      errorSchema, onBlur, onFocus, disabled, readonly } = this.props;
    const { fields } = registry;
    const { SchemaField } = fields;
    return (
      <SchemaField
        key={name}
        name={name}
        required={this.isRequired(name)}
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
      />
    );
  }

  render() {
    const { on } = this.state.formData;
    const { schema, name } = this.props;
    const { title, description } = schema;
    return (
      <div style={{ paddingBottom: '4px' }}>
        <Row>
          <Col span={16}>
            <span >
              {description === undefined ? (title === undefined ? name : title) : description}
            </span>
          </Col>
          <Col span={8} className={styles.hideInnerSpan}>{this.renderSchema('on')}</Col>
        </Row>
        {on ? this.renderSchema('schema') : null}
      </div>
    );
  }
}
