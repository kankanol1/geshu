import React from 'react';
import ColumnScalingStrategyTable from '../Column/ColumnScalingStrategyTable';

export default class ColumnAssemblerConfWidget extends React.Component {
  onPropertyChange(name, value) {
    const dataCopy = Object.assign({}, { ...this.props.formData, [name]: value });
    this.props.onChange(dataCopy);
  }

  renderSchema(name, extraProps = {}, SpecifiedSchemaField) {
    const { registry, schema, idSchema, uiSchema, formData,
      errorSchema, onBlur, onFocus, disabled, readonly } = this.props;
    const { getField } = this.props.uiSchema['ui:options'];
    const { fields } = registry;
    const { SchemaField } = fields;
    const RenderField = SpecifiedSchemaField || SchemaField;
    return (
      <RenderField
        key={name}
        name={name}
        required
        schema={schema.properties[name]}
        uiSchema={{ ...uiSchema[name], ...{ 'ui:options': { getField } } }}
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

  render() {
    return (
      <div >
        {this.renderSchema('inputs', {}, ColumnScalingStrategyTable)}
        {this.renderSchema('output')}
      </div>
    );
  }
}
