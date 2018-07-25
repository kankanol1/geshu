/**
 * the form for settings display.
 */

import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Affix, Icon, Switch } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

import JsonSchemaForm from '../../../../components/JsonSchemaForm';
import validate from '../../../../utils/workspace/formValidation';
import styles from './ComponentSettingsForm.less';

@connect(({ work_component_settings }) => ({
  work_component_settings,
}))
export default class ComponentSettingsForm extends React.PureComponent {
  submitForm() {
    this.submitButton.click();
  }

  handleFormSubmit(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'work_component_settings/saveCurrentComponentSettings',
      payload: {
        id: this.props.match.params.id,
      },
    });
  }

  handleFormChange(value) {
    this.props.dispatch({
      type: 'work_component_settings/setDisplayFormValue',
      payload: {
        dirty: true,
        displayFormData: value.formData,
      },
    });
  }

  resetForm() {
    const { currentComponent } = this.props.work_component_settings;
    this.props.dispatch({
      type: 'work_component_settings/setFormDataForId',
      id: currentComponent,
    });
  }

  clearForm() {
    const { currentComponent, formDataDict } = this.props.work_component_settings;
    this.props.dispatch({
      type: 'work_component_settings/setDisplayFormValue',
      payload: {
        dirty: formDataDict[currentComponent] !== undefined,
        displayFormData: undefined,
      },
    });
  }

  render() {
    const { jsonSchemaDict, uiSchemaDict, currentComponent,
      componentSettings, display } = this.props.work_component_settings;
    const { displayFormData, dirty } = display;

    const jsonSchema = jsonSchemaDict[currentComponent];
    const uiSchema = uiSchemaDict[currentComponent];
    const component = componentSettings[currentComponent];
    return (
      <Fragment>
        <Scrollbars style={{ height: 'calc( 100% - 88px)' }}>
          <JsonSchemaForm
            formData={displayFormData}
            className={styles.settingForm}
            ref={(form) => { this.form = form; }}
            jsonSchema={jsonSchema}
            uiSchema={uiSchema}
            onChange={v => this.handleFormChange(v)}
            onSubmit={v => this.handleFormSubmit(v)}
            validate={(formData, errors) =>
               validate(formData, errors, jsonSchema, uiSchema, component)}
          >
            <button ref={(btn) => { this.submitButton = btn; }} className={styles.hidden} />
          </JsonSchemaForm>
        </Scrollbars>
        <Affix offsetBottom={10} style={{ height: '46px', textAlign: 'center', background: '#fafafa' }}>
          <Button style={{ margin: '5px 10px' }} type="primary" onClick={e => this.submitForm(e)}> <Icon type="save" />保存 </Button>
          <Button style={{ margin: '5px 10px' }} disabled={!dirty} onClick={() => this.resetForm()} > <Icon type="sync" />重置 </Button>
          <Button style={{ margin: '5px 10px' }} type="danger" disabled={jsonSchema === undefined} onClick={() => this.clearForm()} > <Icon type="delete" />清空 </Button>
        </Affix >
      </Fragment>
    );
  }
}
