/**
 * the form for settings display.
 */

import React, { Fragment } from 'react';
import { Row, Col, Input, Button, Affix, Icon, Switch } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

import JsonSchemaForm from '../../../components/JsonSchemaForm';
import styles from './ComponentSettingsForm.less';
import jsonSchemaUtils, { extractJsonSchema, extractUISchema } from '../../../utils/jsonSchemaUtils.js';

export default class ComponentSettingsForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm() {
    this.submitButton.click();
  }

  render() {
    const { jsonSchema, uiSchema } = this.props;
    return (
      <Fragment>
        <Scrollbars style={{ height: 'calc( 100% - 88px)' }}>
          <JsonSchemaForm
            className={styles.settingForm}
            ref={(form) => { this.form = form; }}
            jsonSchema={jsonSchema}
            uiSchema={uiSchema}
            onChange={v => console.log('changed', v)}
            onSubmit={v => console.log('submitted', v)}
            onError={v => console.log('errors', v)}
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
