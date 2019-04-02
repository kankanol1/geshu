import React from 'react';
import { Button, Icon, Form, Radio, Modal } from 'antd';
import XHelp from '@/components/XHelp';
import styles from './OutputSchema.less';
import DefineSchema from './Schemas/DefineSchema';
import TwoSchemaMappingWidget from '@/components/Widgets/TwoSchemaMappingWidget';
import { formItemWithError, expandValidateErrors } from '../Utils';

const sources = {
  manual: ['指定输出模式', DefineSchema],
  // JDBC: ['读取数据表', JDBCDataSource],
};

@Form.create()
class OutputSchema extends React.PureComponent {
  state = {
    type: 'manual',
    display: false,
  };

  renderSettings() {
    const { form } = this.props;
    const { type } = this.state;
    const currentRecord = {};
    const Comp = sources[type][1];
    const formItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const errors = {};
    const validateErrors = {};
    return (
      <React.Fragment>
        <div className={`${styles.middleWrapper} ${styles.switchWrapper}`}>
          {form.getFieldDecorator(`schemaType`, {
            initialValue: (currentRecord && currentRecord.schemaType) || 'manual',
          })(
            <Radio.Group value={type} onChange={v => this.setState({ type: v.target.value })}>
              {Object.keys(sources).map(key => (
                <Radio.Button value={key} key={key}>
                  {sources[key][0]}
                </Radio.Button>
              ))}
            </Radio.Group>
          )}
        </div>
        <Comp
          form={form}
          currentRecord={currentRecord}
          formItemProps={formItemProps}
          validateErrors={{}}
          errors={{}}
        />
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          validateErrors,
          currentRecord,
          'mapping',
          {},
          '模式映射',
          <TwoSchemaMappingWidget />
        )}
      </React.Fragment>
    );
  }

  renderModal() {
    return (
      <Modal
        title="设置输出"
        visible
        width={800}
        maskClosable={false}
        // okButtonDisabled={adding}
        // cancelButtonDisabled={adding}
        // closable={!adding}
        // onOk={e => this.handleOk(e, onOk)}
        onCancel={() => this.setState({ display: false })}
      >
        {this.renderSettings()}
      </Modal>
    );
  }

  render() {
    return (
      <div style={{ marginBottom: '10px' }}>
        <Button onClick={() => this.setState({ display: true })}>设置输出</Button>
        <XHelp tip="通过设置输出模式，可对现有字段和期望字段进行配置和映射。" />
        {this.state.display && this.renderModal()}
      </div>
    );
  }
}

export default OutputSchema;
