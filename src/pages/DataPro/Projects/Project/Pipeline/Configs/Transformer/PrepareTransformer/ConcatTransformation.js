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
      by: '-',
    },
    previewAs: '',
    mode: 'by', // mode: by | as
    schema: [],
    adding: false,
  };

  calPreview = (fields, symbol) => {
    if (fields.length === 0) return '';
    else return fields.join(symbol);
  };

  changeMode(newMode) {
    const { fields, by } = this.state.formData;
    switch (newMode) {
      case 'by':
        this.setState({ mode: 'by', formData: { fields, by: '-' } });
        break;
      case 'as':
        this.setState({ mode: 'as', formData: { fields, as: this.calPreview(fields, by) } });
        break;
      default:
    }
  }

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
          <Col className={styles.center}>
            <Radio.Group
              defaultValue={this.state.mode}
              buttonStyle="solid"
              onChange={v => this.changeMode(v.target.value)}
            >
              <Radio.Button value="by">指定连接符</Radio.Button>
              <Radio.Button value="as">指定列名</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        {this.state.mode === 'by' && (
          <React.Fragment>
            <Row className={styles.formItem}>
              <Col span={6}>
                <span>连接符</span>
              </Col>
              <Col span={18}>
                <Input
                  value={this.state.formData.by}
                  onChange={v => {
                    const { fields } = this.state.formData;
                    const by = v.target.value;
                    this.setState({
                      formData: { fields, by },
                      previewAs: this.calPreview(fields, by),
                    });
                  }}
                />
              </Col>
            </Row>
            <Row className={styles.formItem}>
              <Col span={6}>
                <span>列名预览</span>
              </Col>
              <Col span={18}>
                <Input value={this.state.previewAs} disabled />
              </Col>
            </Row>
          </React.Fragment>
        )}
        {this.state.mode === 'as' && (
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
        )}
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
                const { by } = this.state.formData;
                this.setState({
                  formData: { by, fields: v.value },
                  previewAs: this.calPreview(v.value, by),
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
                by: '-',
              },
              previewAs: this.calPreview(this.props.columns || [], '-'),
            })
          }
        >
          {this.renderForm()}
        </WithSchema>
      </Modal>
    );
  }
}
