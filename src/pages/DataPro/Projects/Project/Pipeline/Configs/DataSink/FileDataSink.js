import React from 'react';
import { Form, Input, Select, Checkbox, Button, Card, Steps, message, Spin } from 'antd';

import { configOperator } from '@/services/datapro/pipelineAPI';
import CSVSinkForm from './Templates/CSVSinkForm';
import { formItemWithError } from '../Utils';

import styles from '../Index.less';

const formRegistry = {
  // first would be the default.
  'com.gldata.gaia.pipeline.api.dataset.formats.CsvFormat': [CSVSinkForm, 'CSV'],
};

@Form.create()
class FileDataSink extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        ...props.configs,
      },
      changed: false,
    };
  }

  handleChange = () => {
    this.setState({ changed: true });
  };

  handleFormSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      const { id, opId } = this.props;
      const newValues = { ...this.state.formValues, ...fieldsValue };
      configOperator({
        projectId: id,
        config: newValues,
        id: opId,
      }).then(response => {
        if (response) {
          if (response.success) {
            message.info('配置完毕');
          } else {
            message.error(response.message);
          }
        }
      });
    });
  }

  render() {
    const { form, errors: givenErrors } = this.props;
    const { loading, changed } = this.state;
    const errors = changed ? {} : givenErrors;
    const type =
      (this.state.formValues && this.state.formValues.type) || Object.keys(formRegistry)[0];

    const ExtraItems = formRegistry[type][0];
    const formItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const currentRecord = this.state.formValues;
    return (
      <Form onSubmit={e => this.handleFormSubmit(e)} style={{ padding: '20px' }}>
        {formItemWithError(
          form,
          formItemProps,
          {
            rules: [{ required: true, message: '数据集类型不能为空' }],
          },
          errors,
          currentRecord,
          'format.formatClass',
          type,
          '文件类型',
          <Select onChange={() => this.handleChange()}>
            {Object.keys(formRegistry).map((k, i) => (
              <Select.Option key={i} value={k}>
                {' '}
                {formRegistry[k][1]}{' '}
              </Select.Option>
            ))}
          </Select>
        )}
        <ExtraItems
          form={form}
          currentRecord={currentRecord}
          formItemProps={formItemProps}
          id={this.props.id}
          name={this.props.name}
          errors={errors}
          onChange={() => this.handleChange()}
        />
        <div>
          <div className={styles.centerWrapper}>
            <Button type="primary" htmlType="submit" loading={loading}>
              完成
            </Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default FileDataSink;
