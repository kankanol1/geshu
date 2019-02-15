import React from 'react';
import { Modal, message } from 'antd';
import { addTransformation } from '@/services/datapro/pipelineAPI';

import ColumnMappingWidget from '@/components/JsonSchemaForm/Widgets/Column/ColumnMappingWidget';
import WithSchema from './WithSchema';

export default class RenameTransformation extends React.PureComponent {
  state = {
    formData: [],
    schema: [],
    adding: false,
  };

  handleOk() {
    const { id, opId, configs, onOk } = this.props;
    this.setState({ adding: true });
    // submit
    addTransformation({
      projectId: id,
      id: opId,
      config: { type: 'RenameTransformation', config: { columns: this.state.formData } },
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

  renderForm() {
    return (
      <ColumnMappingWidget
        uiSchema={{
          'ui:options': {
            inputColumnTitle: '原列名',
            outputColumnTitle: '新列名',
            getField: () => {
              return this.state.schema;
            },
          },
        }}
        formData={{ value: this.state.formData }}
        onChange={v => this.setState({ formData: v.value })}
      />
    );
  }

  render() {
    const { onCancel } = this.props;
    return (
      <Modal
        title="重命名列"
        visible
        onOk={() => this.handleOk()}
        onCancel={onCancel}
        okButtonProps={{ loading: this.state.adding }}
      >
        <WithSchema {...this.props} onLoad={schema => this.setState({ schema })}>
          {this.renderForm()}
        </WithSchema>
      </Modal>
    );
  }
}
