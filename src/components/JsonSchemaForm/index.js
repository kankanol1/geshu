/** generate form using json schema */

import React from 'react';
import { Row, Col, Input, Button, Icon } from 'antd';
import Form from 'react-jsonschema-form';
import styles from './index.less';
import SampleWidget from './Widgets/SampleWidget';
import SwitchSchemaWidget from './Widgets/SwitchSchemaWidget';

const ButtonGroup = Button.Group;


const registeredFields = {
  sample: SampleWidget,
  switch_schema: SwitchSchemaWidget,
};

const CustomFieldTemplate = (props) => {
  const { id, classNames, label, help, required, description, errors, children, schema } = props;
  return (
    <div className={classNames}>
      {children}
      {errors}
      {help}
    </div>
  );
};

const ObjectFieldTemplate = (props) => {
  const { required, TitleField, properties, title, description, schema, idSchema } = props;
  // if only one child, use inline.

  if (Object.keys(schema.properties).length === 1 &&
    schema.properties[Object.keys(schema.properties)[0]].properties === undefined &&
    schema.properties[Object.keys(schema.properties)[0]].type !== 'array') {
    let displayTitle = description === undefined ? title : description;
    if (schema.required && schema.required.length !== 0) {
      displayTitle += ' *';
    }
    return (
      <Row>
        <Col span={8}>
          <TitleField title={displayTitle} />
        </Col>
        <Col span={16}>
          {properties.map(prop => (
            <div
              key={prop.content.key}
            >
              {prop.content}
            </div>
          ))}
        </Col>
      </Row>
    );
  }

  let displayTitle = title;
  if (required) {
    displayTitle += ' *';
  }
  return (
    <div>
      {
        // do not display root title.
        idSchema.$id === 'root' ? null : <TitleField title={displayTitle} />
      }
      <div className="row">
        {properties.map(prop => (
          <div
            key={prop.content.key}
          >
            {prop.content}
          </div>
        ))}
      </div>
      {description}
    </div>
  );
};


const ArrayFieldTemplate = (props) => {
  return (
    <div className={props.className}>
      <hr />
      <Row style={{ height: '36px' }}>
        <Col span={20}><span style={{ lineHeight: '36px' }}>{props.title}</span></Col>
        {props.canAdd && (
          <Col span={4}>
            <Button onClick={props.onAddClick} type="primary">
              <Icon type="plus" />
            </Button>
          </Col>
      )}
      </Row>
      {props.items &&
        props.items.map(element => (
          <Row key={element.index} className="arr-row">
            <Col span={18}>{element.children}</Col>
            <Col span={6}>
              <ButtonGroup>
                <Button
                  onClick={element.onReorderClick(
                    element.index,
                    element.index - 1
                  )}
                  disabled={!element.hasMoveUp}
                  className="slim-btn"
                >
                  <Icon type="up" />
                </Button>
                <Button
                  onClick={element.onReorderClick(
                    element.index,
                    element.index + 1
                  )}
                  className="slim-btn"
                  disabled={!element.hasMoveDown}
                >
                  <Icon type="down" />
                </Button>
                <Button onClick={element.onDropIndexClick(element.index)} className="slim-btn" type="danger">
                  <Icon type="close" />
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        ))}
      <hr />

    </div>
  );
};

export default class JsonSchemaForm extends React.PureComponent {
  render() {
    return (
      <Form
        {...this.props}
        ref={(form) => { this.form = form; }}
        schema={this.props.jsonSchema}
        FieldTemplate={CustomFieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
        className={styles.settingsForm}
        fields={{ ...registeredFields, ...this.props.fields }}
        // html5 validation will prevent from submitting when there are required checkboxes.
        noHtml5Validate
      >
        {this.props.children}
      </Form>
    );
  }
}
