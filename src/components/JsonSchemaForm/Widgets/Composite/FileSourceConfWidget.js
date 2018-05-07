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
      formData: { ...props.formData, header: { value: true } },
    });
  }

  onPropertyChange(name, value) {
    const dataCopy = Object.assign({}, { ...this.state.formData, [name]: value });
    const lastShowExtra = this.showExtra(this.state.formData);
    const showExtra = this.showExtra(dataCopy);
    this.setState({
      formData: dataCopy,
    }, () => {
      this.props.onChange(dataCopy);
      if (showExtra && !lastShowExtra) {
        this.fetchSchema();
      }
    });
  }

  showExtra = (formData) => {
    return formData.format.value !== undefined && formData.path.value !== undefined;
  }

  fetchSchema() {
    this.setState({
      loading: true,
    });
    const { formData } = this.state;
    // fetch options
    const fetchOptions = {
      credentials: 'include',
      method: 'POST',
    };
    fetch('/api/component/fetchschema', fetchOptions).then(results => results.json())
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

  renderSchema(name) {
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
      />
    );
  }

  render() {
    const { required, TitleField, properties, title, description, schema, idSchema } = this.props;
    const { formData, loading } = this.state;
    const renderSchema = formData.format.value !== undefined && formData.path.value !== undefined;
    return (
      <div >
        {this.renderSchema('format')}
        {this.renderSchema('path')}
        {this.renderSchema('header')}
        {
          loading ?
            <div className={styles.spin} ><Spin /></div> :
          (renderSchema ? this.renderSchema('definedSchema') : null)
        }
      </div>
    );
  }
}
