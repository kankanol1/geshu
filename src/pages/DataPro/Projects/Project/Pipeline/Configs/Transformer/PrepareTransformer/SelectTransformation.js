import React from 'react';
import { Modal, message } from 'antd';
import { addTransformation } from '@/services/datapro/pipelineAPI';

import ColumnSelectCheckboxWidget from '@/components/JsonSchemaForm/Widgets/Column/ColumnSelectCheckboxWidget';
import WithSchema from './WithSchema';

class SelectTransformation extends React.PureComponent {
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
      config: { type: 'SelectTransformation', config: { fields: this.state.formData } },
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

  render() {
    const { onCancel } = this.props;
    return (
      <Modal
        title="选择列"
        visible
        onOk={() => this.handleOk()}
        onCancel={onCancel}
        okButtonProps={{ loading: this.state.adding }}
      >
        <WithSchema {...this.props} onLoad={schema => this.setState({ schema })}>
          <ColumnSelectCheckboxWidget
            uiSchema={{
              'ui:options': {
                getField: () => {
                  return this.state.schema;
                },
              },
            }}
            formData={{ value: this.state.formData }}
            onChange={v => this.setState({ formData: v.value })}
          />
        </WithSchema>
      </Modal>
    );
  }
}

export default SelectTransformation;
