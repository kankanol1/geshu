/** generate form using json schema */

import React, { Fragment } from 'react';
import { Row, Col, Input, Button, Affix, Icon, Switch } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Form from 'react-jsonschema-form';

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
  const { TitleField, properties, title, description, schema } = props;
  // if only one child, use inline.
  if (Object.keys(schema.properties).length === 1) {
    console.log('inline');
    return (
      <div>
        <TitleField title={description === undefined ? title : description} />
        <div className="row">
          {properties.map(prop => (
            <div
              className="col-lg-2 col-md-4 col-sm-6 col-xs-12"
              key={prop.content.key}
            >
              {prop.content}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <TitleField title={title} />
      <div className="row">
        {properties.map(prop => (
          <div
            className="col-lg-2 col-md-4 col-sm-6 col-xs-12"
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
      >
        {this.props.children}
      </Form>
    );
  }
}
