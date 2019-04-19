import React from 'react';
import { Form, Modal, Radio, message, Row, Col, Input } from 'antd';
import { getTransformationSchema, addTransformation } from '@/services/datapro/pipelineAPI';

import CheckboxSelectColumnWidget from '@/components/Widgets/CheckboxSelectColumnWidget';
import WithSchema from './WithSchema';
import { formItemWithError, expandValidateErrors } from '../../Utils';
import styles from '../PrepareTransformer.less';

@Form.create()
class ConcatTransformation extends React.PureComponent {
  state = {
    formValues: {},
    schema: [],
    adding: false,
    validateErrors: undefined,
  };

  handleOk() {
    const { id, opId, configs, onOk, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      this.setState({ validateErrors: expandValidateErrors(err) });
      if (!err) {
        this.setState({ adding: true });
        // submit
        addTransformation({
          projectId: id,
          id: opId,
          config: { type: 'ConcatTransformation', config: this.state.formData },
        }).then(response => {
          if (response) {
            if (response.success) {
              message.info('添加成功');
              onOk();
            } else {
              message.error(`添加失败:${response.message}，请重试`);
            }
          }
        });
      }
    });
  }

  renderForm() {
    const { form } = this.props;
    const { validateErrors, formValues } = this.state;
    const errors = {};
    const formItemProps = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <Form>
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          validateErrors,
          formValues,
          'as',
          '',
          '新列名',
          <Input />
        )}
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          validateErrors,
          formValues,
          'by',
          '_',
          '连接符',
          <Input />
        )}
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          validateErrors,
          formValues,
          'fields',
          [],
          '合并列',
          <CheckboxSelectColumnWidget schema={this.state.schema} />
        )}
      </Form>
    );
  }

  render() {
    const { onCancel } = this.props;
    return (
      <Modal
        title="列合并"
        visible
        onOk={() => this.handleOk()}
        onCancel={onCancel}
        okButtonProps={{ loading: this.state.adding }}
        width={600}
      >
        <WithSchema
          {...this.props}
          onLoad={schema =>
            this.setState({
              schema,
              formValues: this.props.configs || {
                fields: this.props.columns || [],
                by: '',
                as: (this.props.columns || []).join('_'),
              },
            })
          }
        >
          {this.renderForm()}
        </WithSchema>
      </Modal>
    );
  }
}

export default ConcatTransformation;
