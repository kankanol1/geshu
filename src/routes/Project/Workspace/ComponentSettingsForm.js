/**
 * the form for settings display.
 */

import React, { Fragment } from 'react';
import { Row, Col, Input, Button, Affix, Icon, Switch } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

import JsonSchemaForm from '../../../components/JsonSchemaForm';
import styles from './ComponentSettingsForm.less';
import { extractJsonSchema, extractUISchema } from '../../../utils/jsonSchemaUtils.js';

export default class ComponentSettingsForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm() {
    this.submitButton.click();
  }

  render() {
    const { jsonschema } = this.props;
    const extractedJsonSchema = extractJsonSchema(jsonschema);
    const uiSchema = extractUISchema(jsonschema);
    return (
      <Fragment>
        <Scrollbars style={{ height: 'calc( 100% - 88px)' }}>
          <JsonSchemaForm
            className={styles.settingForm}
            ref={(form) => { this.form = form; }}
            jsonschema={extractedJsonSchema}
            uiSchema={uiSchema}
            onChange={() => console.log('changed')}
            onSubmit={v => console.log('submitted', v)}
            onError={() => console.log('errors')}
          >
            <button ref={(btn) => { this.submitButton = btn; }} className={styles.hidden} />
          </JsonSchemaForm>
        </Scrollbars>
        <Affix offsetBottom={10} style={{ height: '46px', textAlign: 'center', background: '#fafafa' }}>
          <Button style={{ margin: '5px 10px' }} type="primary" onClick={this.submitForm}> <Icon type="save" />保存 </Button>
          <Button style={{ margin: '5px 10px' }} type="danger"> <Icon type="sync" />重置 </Button>
        </Affix >
      </Fragment>
    );
  }
}
