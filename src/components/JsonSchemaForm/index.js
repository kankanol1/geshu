/** generate form using json schema */

import React, { Fragment } from 'react';
import { Row, Col, Input, Button, Affix, Icon, Switch } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Form from 'react-jsonschema-form';
import styles from './index.less';

const CustomFieldTemplate = (props) => {
  const { id, classNames, label, help, required, description, errors, children, schema } = props;
  console.log('schema', schema);
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
  console.log('id schema', schema);
  // if only one child, use inline.

  if (Object.keys(schema.properties).length === 1 &&
    schema.properties[Object.keys(schema.properties)[0]].properties === undefined) {
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
      {props.items &&
        props.items.map(element => (
          <div key={element.index}>
            <div>{element.children}</div>
            {element.hasMoveDown && (
              <button
                onClick={element.onReorderClick(
                  element.index,
                  element.index + 1
                )}
              >
                Down
              </button>
            )}
            {element.hasMoveUp && (
              <button
                onClick={element.onReorderClick(
                  element.index,
                  element.index - 1
                )}
              >
                Up
              </button>
            )}
            <button onClick={element.onDropIndexClick(element.index)}>
              Delete
            </button>
            <hr />
          </div>
        ))}

      {props.canAdd && (
        <div className="row">
          <p className="col-xs-3 col-xs-offset-9 array-item-add text-right">
            <button onClick={props.onAddClick} type="button">
              Custom +
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default class JsonSchemaForm extends React.PureComponent {
  render() {
    console.log('json schema', this.props.jsonschema);
    return (
      <Form
        {...this.props}
        ref={(form) => { this.form = form; }}
        schema={this.props.jsonschema}
        FieldTemplate={CustomFieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
        className={styles.settingsForm}
      >
        {this.props.children}
      </Form>
    );
  }
}
