/** generate form using json schema */

import React, { Fragment } from 'react';
import { Row, Col, Input, Button, Affix, Icon, Switch } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Form from 'react-jsonschema-form';


export default class JsonSchemaForm extends React.PureComponent {
  render() {
    console.log('json schema', this.props.jsonschema);
    return (
      <Form
        {...this.props}
        ref={(form) => { this.form = form; }}
        schema={this.props.jsonschema}
      >
        {this.props.children}
      </Form>
    );
  }
}
