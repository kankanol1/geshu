import React from 'react';
import { Col, Row, Spin } from 'antd';
import styles from './FileSourceConfWidget.less';

export default class FileSourceConfWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: { ...props.formData },
      loading: false,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      formData: { ...props.formData },
    });
  }

  onPropertyChange(name, value) {
    const dataCopy = Object.assign({}, { ...this.state.formData, [name]: value });
    const showExtra = this.showExtra(dataCopy);
    const needRefreshSchema = this.needRefreshSchema(dataCopy, this.state.formData);
    this.setState({
      formData: dataCopy,
    }, () => {
      this.props.onChange(dataCopy);
      if (showExtra && needRefreshSchema) {
        this.fetchSchema();
      }
    });
  }

  showExtra = (formData) => {
    return formData.format !== undefined && formData.path.value !== undefined;
  }

  needRefreshSchema = (newFormData, oldFormData) => {
    return newFormData.format !== oldFormData.format ||
      newFormData.path.value !== oldFormData.path.value ||
      newFormData.header.value !== oldFormData.header.value;
  }

  fetchSchema() {
    const { name } = this.props;
    const { url } = this.props.uiSchema['ui:options'];
    this.setState({
      loading: true,
    });
    const { formData } = this.state;
    const data = JSON.stringify({
      format: formData.format,
      header: formData.header.value,
      path: formData.path.value,
    });
    // fetch options
    const fetchOptions = {
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: data,
    };
    fetch(url, fetchOptions).then(results => results.json())
      .then(
        (result) => {
          // change schema
          const newFormData = { ...this.state.formData,
            definedSchema: { on: true, schema: result.data } };
          this.setState({ loading: false, formData: newFormData },
            () => this.props.onChange(newFormData));
        }
      );
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

  render() {
    const { formData, loading } = this.state;
    const renderSchema = formData.format !== undefined && formData.path.value !== undefined;
    return (
      <div >
        {this.renderSchema('format', { disabled: loading })}
        {this.renderSchema('path', { disabled: loading })}
        {this.renderSchema('header', { disabled: loading })}
        {
          loading ?
            <div className={styles.spin} ><Spin /></div> :
          (renderSchema ? this.renderSchema('definedSchema', { mode: 'modify' }) : null)
        }
      </div>
    );
  }
}
