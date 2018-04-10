/** generate form using json schema */

import React from 'react';
import { Row, Col, Input, Button, Icon } from 'antd';
import Form from 'react-jsonschema-form';
import JsonPath from 'jsonpath';
import styles from './index.less';
import SampleWidget from './Widgets/SampleWidget';
import SwitchSchemaWidget from './Widgets/SwitchSchemaWidget';
import DefineSchemaWidget from './Widgets/DefineSchemaWidget';
import SelectWidget from './Widgets/SelectWidget';
import FileSelectorWidget from './Widgets/FileSelectorWidget';
import ObjectFieldTemplate from './Templates/ObjectFieldTemplate';
import AnyValueWidget from './Widgets/AnyValueWidget';

const ButtonGroup = Button.Group;

const registeredWidgets = {
  SelectWidget,
};

const registeredFields = {
  sample: SampleWidget,
  switch_schema: SwitchSchemaWidget,
  define_schema: DefineSchemaWidget,
  select_schema: FileSelectorWidget,
  any_value: AnyValueWidget,
};

const CustomFieldTemplate = (props) => {
  const { id, classNames, label, displayLabel, help,
    required, title, errors, children, schema } = props;
  const { description } = props;
  if (displayLabel) {
    return (
      <Row className={classNames}>
        <Col span={8}><legend> {description} </legend></Col>
        <Col span={16}>{children}</Col>
        {/* uncomment the following line will display errors for each item */}
        {/* {errors} */}
        {help}
      </Row>
    );
  }
  return (
    <div className={classNames}>
      {children}
      {/* uncomment the following line will display errors for each item */}
      {/* {errors} */}
      {help}
    </div>
  );
};


const ArrayFieldTemplate = (props) => {
  const { schema, title } = props;
  const { description } = schema;
  return (
    <div className={props.className}>
      <hr />
      <Row style={{ height: '36px' }}>
        <Col span={20}><span style={{ lineHeight: '36px' }}>{description === undefined ? title : description}</span></Col>
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

const replaceLastPathTo = (pathSelector, lastPath) => {
  const pathArr = pathSelector.split('.');
  pathArr[pathArr.length - 1] = lastPath;
  return pathArr.join('.');
};

export default class JsonSchemaForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.transformErrors = this.transformErrors.bind(this);
  }

  transformErrors(errors) {
    const schema = this.props.jsonSchema;
    const transformedErrors = errors.map((e) => {
      if (e.name === 'required') {
        const title = JsonPath.query(schema, `$.${replaceLastPathTo(e.property, 'title')}`);
        const description = JsonPath.query(schema, `$.${replaceLastPathTo(e.property, 'description')}`);
        return { ...e, stack: `"${description.length === 0 ? title[0] : description[0]}" 为必填项`, message: '必填' };
      } else return e;
    });
    return transformedErrors;
  }

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
        widgets={{ ...registeredWidgets, ...this.props.widgets }}
        transformErrors={this.transformErrors}
        // html5 validation will prevent from submitting when there are required checkboxes.
        noHtml5Validate
        // disable error list display.
        showErrorList
        safeRenderCompletion
      >
        {this.props.children}
      </Form>
    );
  }
}
