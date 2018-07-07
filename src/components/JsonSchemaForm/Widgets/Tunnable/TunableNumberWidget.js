import React from 'react';
import { Row, Col, Input, Button, Icon } from 'antd';
import styles from '../../index.less';

export default class TunableNumberWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
      formData: { ...props.formData },
    };
  }

  onPropertyChange(name, value) {
    const dataCopy = { ...this.state.formData, [name]: value };
    this.setState({
      formData: dataCopy,
    }, () => {
      this.props.onChange(dataCopy);
    });
  }

  toggleState() {
    this.setState({ expand: !this.state.expand });
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
    const { required, properties, schema, idSchema, registry } = this.props;

    const { TitleField } = registry.fields;
    const { title, description } = schema;
    let displayTitle = description === undefined ? title : description;
    if (required) {
      displayTitle += ' *';
    }
    const isRoot = idSchema.$id === 'root';
    return (
      <div className={isRoot ? null : styles.groupDiv}>
        <div onClick={() => this.toggleState()} className={styles.groupHeader} >
          {
          isRoot ? null :
          (
            <Row>
              <Col span={2} >
                <Icon type={this.state.expand ? 'down' : 'right'} className={styles.groupIcon} />
              </Col>
              <Col span={22} >
                <TitleField title={displayTitle} className={styles.groupLegend} />
              </Col>
            </Row>
          )
        }
        </div>
        { this.state.expand ?
        (
          <div className={isRoot ? null : styles.groupContent}>
            {this.renderSchema('tunableType')}
            {this.renderSchema('tunableValue')}
            {this.renderSchema('value')}
          </div>
        )
        : null
        }
      </div>
    );
  }
}
