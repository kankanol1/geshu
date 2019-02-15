import React from 'react';
import { Modal, Spin, message, Row, Col, Input } from 'antd';
import { getTransformationSchema, addTransformation } from '@/services/datapro/pipelineAPI';

import ColumnSelectCheckboxWidget from '@/components/JsonSchemaForm/Widgets/Column/ColumnSelectCheckboxWidget';
import WithSchema from './WithSchema';

export default class MergeTransformation extends React.PureComponent {
  state = {
    formData: {
      columns: [],
      by: '',
      as: '',
    },
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
      config: { type: 'MergeTransformation', config: this.state.formData },
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
      <div>
        <Row>
          <Col span={4}>
            <label>连接符</label>
          </Col>
          <Col span={8}>
            <Input
              value={this.state.formData.by || ''}
              onChange={v =>
                this.setState({ formData: { ...this.state.formData, by: v.target.value } })
              }
            />
          </Col>
          <Col span={4}>
            <label>新列名</label>
          </Col>
          <Col span={8}>
            <Input
              value={this.state.formData.as || ''}
              onChange={v =>
                this.setState({ formData: { ...this.state.formData, as: v.target.value } })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ColumnSelectCheckboxWidget
              uiSchema={{
                'ui:options': {
                  getField: () => {
                    return this.state.schema;
                  },
                },
              }}
              formData={{ value: this.state.formData.columns }}
              onChange={v =>
                this.setState({ formData: { ...this.state.formData, columns: v.value } })
              }
            />
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { onCancel } = this.props;
    return (
      <Modal
        title="多列连接"
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
