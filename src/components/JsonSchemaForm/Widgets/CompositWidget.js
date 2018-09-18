import React from 'react';

/**
 * Provides basic operations for composite different widgets.
 */
export default class CompositeWidget extends React.PureComponent {
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

  onPropertyChanged(name, value) {
    const dataCopy = { ...this.state.formData, [name]: value };
    this.onFormDataChanged(dataCopy);
  }

  onFormDataChanged(newFormData, callback = undefined) {
    this.setState({
      formData: newFormData,
    }, () => {
      this.props.onChange(newFormData);
      if (callback) callback();
    });
  }

  isRequired(name) {
    const { schema } = this.props;
    return (
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
    );
  }

  // render child schema, while keeps form
  renderSchema(name, extraProps = {}, extraUISchema = {},
    SpecifiedSchemaField = undefined, extraSchema = {}) {
    const { registry, schema, idSchema, formData, uiSchema,
      errorSchema, onBlur, onFocus, disabled, readonly } = this.props;
    const { fields } = registry;
    const { SchemaField } = fields;
    const RenderField = SpecifiedSchemaField || SchemaField;
    return (
      <RenderField
        key={name}
        name={name}
        required={this.isRequired(name)}
        schema={{ ...schema.properties[name], ...extraSchema }}
        uiSchema={{ ...uiSchema[name], ...extraUISchema }}
        errorSchema={errorSchema[name]}
        idSchema={idSchema[name]}
        formData={formData[name]}
        onChange={value => this.onPropertyChanged(name, value)}
        onBlur={onBlur}
        onFocus={onFocus}
        registry={registry}
        disabled={disabled}
        readonly={readonly}
        {...extraProps}
      />
    );
  }

  // render nothing, needs to be extended.
  render() { return null; }
}
