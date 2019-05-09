import React from 'react';
import { Form, Modal, message } from 'antd';
import { getTransformationSchema, addTransformation } from '@/services/datapro/pipelineAPI';
import WithSchema from './WithSchema';
import { formItemWithError, expandValidateErrors } from '../../Utils';
import FillNullConfig from '@/components/Widgets/Composite/FillNullConfig';

class FillNullTransformation extends React.PureComponent {
  state = {
    formValues: [],
    schema: [],
    adding: false,
    // validateErrors: undefined,
  };

  handleOk() {
    const { id, opId, configs, onOk, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      // this.setState({ validateErrors: expandValidateErrors(err) });
      if (!err) {
        this.setState({ adding: true });
        // submit
        addTransformation({
          projectId: id,
          id: opId,
          config: { type: 'ConcatTransformation', config: fieldsValue },
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
          onLoad={schema => {
            this.setState({
              schema,
              // TODO: add init values.
              formValues: {},
            });
          }}
        >
          <FillNullConfig
            schema={this.state.schema}
            value={this.state.formValues}
            onChange={v => this.setState({ formValues: v })}
          />
        </WithSchema>
      </Modal>
    );
  }
}

export default FillNullTransformation;
