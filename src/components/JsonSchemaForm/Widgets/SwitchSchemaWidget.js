import React from 'react';

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
    return (
      <div>
        {this.renderSchema('on')}
        {on ? this.renderSchema('schema') : null}
      </div>
    );
  }
}
