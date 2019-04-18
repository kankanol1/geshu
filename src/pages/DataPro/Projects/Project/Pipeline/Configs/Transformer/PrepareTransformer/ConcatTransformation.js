import React from 'react';
import { Modal, Radio, message, Row, Col, Input } from 'antd';
import { getTransformationSchema, addTransformation } from '@/services/datapro/pipelineAPI';

import ColumnSelectCheckboxWidget from '@/components/JsonSchemaForm/Widgets/Column/ColumnSelectCheckboxWidget';
import WithSchema from './WithSchema';
import styles from '../PrepareTransformer.less';

export default class ConcatTransformation extends React.PureComponent {
  state = {
    formData: {
      fields: [],
      by: '',
      as: undefined,
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

  renderForm() {
    return (
      <div>
        <Row className={styles.formItem}>
          <Col span={6}>
            <span>连接符</span>
          </Col>
          <Col span={18}>
            <Input
              value={this.state.formData.by}
              onChange={v => {
                const by = v.target.value;
                this.setState({
                  formData: { ...this.state.formData, by },
                });
              }}
            />
          </Col>
        </Row>
        <Row className={styles.formItem}>
          <Col span={6}>
            <span>新列名</span>
          </Col>
          <Col span={18}>
            <Input
              value={this.state.formData.as}
              onChange={v =>
                this.setState({ formData: { ...this.state.formData, as: v.target.value } })
              }
            />
          </Col>
        </Row>
        <Row className={styles.formItem}>
          <Col span={24}>
            <ColumnSelectCheckboxWidget
              uiSchema={{
                'ui:options': {
                  getField: () => {
                    return this.state.schema;
                  },
                },
              }}
              formData={{ value: this.state.formData.fields }}
              onChange={v => {
                this.setState({
                  formData: { ...this.state.formData, fields: v.value },
                });
              }}
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
        title="列合并"
        visible
        onOk={() => this.handleOk()}
        onCancel={onCancel}
        okButtonProps={{ loading: this.state.adding }}
      >
        <WithSchema
          {...this.props}
          onLoad={schema =>
            this.setState({
              schema,
              formData: {
                fields: this.props.columns || [],
                by: '',
                as: (this.props.columns || []).join('-'),
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
