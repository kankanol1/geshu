/**
 * the form for settings display.
 */

import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Affix, Icon, Switch } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

import JsonSchemaForm from '../../../components/JsonSchemaForm';
import styles from './ComponentSettingsForm.less';

@connect(({ work_component_settings }) => ({
  work_component_settings,
}))
export default class ComponentSettingsForm extends React.PureComponent {
  constructor(props) {
    super(props);
    const { currentComponent, formDataDict } = props.work_component_settings;
    this.state = {
      dirty: false,
      displayFormData: formDataDict[currentComponent],
    };
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm() {
    this.submitButton.click();
  }

  handleFormSubmit(value) {
    const { formData } = value;
    const { work_component_settings, dispatch, match } = this.props;
    const { currentComponent } = work_component_settings;
    console.log('submitted', value);

    this.setState({
      dirty: false,
      displayFormData: formData,
    });

    dispatch({
      type: 'work_component_settings/saveComponentSettings',
      payload: {
        projectId: match.params.id,
        componentId: currentComponent,
        formData,
      },
    });
  }

  handleFormChange(value) {
    this.setState({ dirty: true, displayFormData: value.formData });
  }

  resetForm() {
    const { currentComponent, formDataDict } = this.props.work_component_settings;
    this.setState({
      dirty: false,
      displayFormData: formDataDict[currentComponent],
    });
  }

  clearForm() {
    const { currentComponent, formDataDict } = this.props.work_component_settings;
    const dirty = formDataDict[currentComponent] !== undefined;
    this.setState({
      dirty,
      displayFormData: undefined,
    });
  }

  render() {
    const { jsonSchemaDict, uiSchemaDict, currentComponent } = this.props.work_component_settings;
    const { displayFormData, dirty } = this.state;

    const jsonSchema = jsonSchemaDict[currentComponent];
    const uiSchema = uiSchemaDict[currentComponent];
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
            onError={v => console.log('errors', v)}
            noValidate
          >
            <button ref={(btn) => { this.submitButton = btn; }} className={styles.hidden} />
          </JsonSchemaForm>
        </Scrollbars>
        <Affix offsetBottom={10} style={{ height: '46px', textAlign: 'center', background: '#fafafa' }}>
          <Button style={{ margin: '5px 10px' }} type="primary" onClick={this.submitForm}> <Icon type="save" />保存 </Button>
          <Button style={{ margin: '5px 10px' }} disabled={!dirty} onClick={() => this.resetForm()} > <Icon type="sync" />重置 </Button>
          <Button style={{ margin: '5px 10px' }} type="danger" disabled={jsonSchema === undefined} onClick={() => this.clearForm()} > <Icon type="delete" />清空 </Button>
        </Affix >
      </Fragment>
    );
  }
}
