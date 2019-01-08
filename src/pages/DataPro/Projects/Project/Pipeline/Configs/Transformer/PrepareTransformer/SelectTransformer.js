import React from 'react';
import { Modal, Spin, message } from 'antd';
import { getTransformationSchema, addTransformation } from '@/services/datapro/pipelineAPI';

import ColumnSelectCheckboxWidget from '@/components/JsonSchemaForm/Widgets/Column/ColumnSelectCheckboxWidget';

class SelectTransformer extends React.PureComponent {
  state = {
    loading: true,
    schema: undefined,
    error: false,
    formData: [],
    adding: false,
  };

  componentDidMount() {
    // fetch schema.
    const { id, opId, configs } = this.props;
    getTransformationSchema({
      projectId: id,
      id: opId,
      pos: configs.length,
    }).then(response => {
      if (response) {
        if (response.success) {
          this.setState({ schema: response.data, loading: false });
        } else {
          this.setState({ error: false, loading: false });
        }
      }
    });
  }

  handleOk() {
    const { id, opId, configs, onOk } = this.props;
    this.setState({ adding: true });
    // submit
    addTransformation({
      projectId: id,
      id: opId,
      config: { type: 'SelectTransformer', configs: this.state.formData },
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
    );
  }

  renderErrorTip = () => {
    return <span style={{ color: 'red' }}>加载信息失败，请关闭重试</span>;
  };

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
        {this.state.loading ? (
          <Spin spinning={this.state.loading} />
        ) : this.state.error ? (
          this.renderErrorTip()
        ) : (
          this.renderForm()
        )}
      </Modal>
    );
  }
}

export default SelectTransformer;
