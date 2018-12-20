import React from 'react';
import { Form, Input, Select, Checkbox, Button, Card, Steps, Progress, Spin } from 'antd';
import router from 'umi/router';

import { getSchemaFromFile, configOperator } from '@/services/datapro/pipelineAPI';
import DefineSchemaWidget from '@/components/JsonSchemaForm/Widgets/Schema/DefineSchemaWidget';
import CSVDatasetForm from './Templates/CSVDatasetForm';
import { formItemWithError } from '../Utils';

import styles from '../Index.less';

const formRegistry = {
  'com.gldata.gaia.pipeline.api.dataset.formats.CsvFormat': CSVDatasetForm,
};

const FormItem = Form.Item;
const { TextArea } = Input;
const { Step } = Steps;

const formats = {
  'com.gldata.gaia.pipeline.api.dataset.formats.CsvFormat': 'CSV',
};

class FileDataSourceConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      formValues: {
        ...props.configs,
      },

      schemaResponse: undefined,
      loading: false,
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
      if (!err) {
        // TODO: fetch schema.
        this.setState({ loading: true });
        const newValues = { ...this.state.formValues, ...fieldsValue };
        const { id, opId } = this.props;
        getSchemaFromFile({
          projectId: id,
          config: newValues,
          id: opId,
        }).then(response => {
          this.setState({
            current: 1,
            formValues: newValues,
            schemaResponse: response,
            loading: false,
            changed: false,
          });
        });
      }
    });
  }

  handleSchemaDone(e) {
    e.preventDefault();
    const { formValues, schema } = this.state;
    const newValue = { ...formValues, schema: schema || this.state.schemaResponse.schema };
    const { id, opId } = this.props;
    configOperator({
      projectId: id,
      config: newValue,
      id: opId,
    }).then(response => {
      this.setState({ current: 2, result: response });
    });
  }

  renderUpload = () => {
    const { form, errors: givenErrors } = this.props;
    const { loading, changed } = this.state;
    const errors = changed ? {} : givenErrors;
    const type =
      (this.state.formValues && this.state.formValues.type) ||
      'com.gldata.gaia.pipeline.api.dataset.formats.CsvFormat';

    const ExtraItems = formRegistry[type];
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
          'formatClass',
          type,
          '文件类型',
          <Select onChange={() => this.handleChange()}>
            <Select.Option value="com.gldata.gaia.pipeline.api.dataset.formats.CsvFormat">
              CSV
            </Select.Option>
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
          <div className={styles.rightFloatWrapper}>
            <Button type="primary" htmlType="submit" loading={loading}>
              下一步&nbsp;&gt;
            </Button>
          </div>
        </div>
      </Form>
    );
  };

  renderSuccessForm = message => {
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <Progress type="circle" percent={100} />
        <div style={{ padding: '10px' }}>
          <span>{message}</span>
        </div>
        <div style={{ padding: '20px' }}>
          <Button
            type="primary"
            onClick={() => {
              router.push(`/projects/p/pipeline/${this.props.id}`);
            }}
          >
            返回
          </Button>
        </div>
      </div>
    );
  };

  renderFailForm = message => {
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <Progress type="circle" percent={100} status="exception" />
        <div style={{ padding: '10px' }}>
          <span>{message}</span>
        </div>
        <div style={{ padding: '20px' }}>
          <Button
            onClick={() => {
              this.setState({ current: 1 });
            }}
          >
            返回修改
          </Button>
        </div>
      </div>
    );
  };

  renderResultForm = () => {
    const { result } = this.state;
    return result.success
      ? this.renderSuccessForm(result.message)
      : this.renderFailForm(result.message);
  };

  renderSchema() {
    const { success, message, schema } = this.state.schemaResponse;
    const { loading } = this.state;
    return (
      <div style={{ padding: '20px' }}>
        {success ? (
          <DefineSchemaWidget
            formData={this.state.schema || schema}
            onChange={v => this.setState({ schema: v })}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <span style={{ color: 'red' }}>{message}</span>
          </div>
        )}
        <div>
          <Button onClick={() => this.setState({ current: 0 })}>&lt;&nbsp;返回上一步</Button>
          {success ? (
            <div className={styles.rightFloatWrapper}>
              <Button type="primary" onClick={e => this.handleSchemaDone(e)} loading={loading}>
                下一步&nbsp;&gt;
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Card>
          <Steps progressDot current={this.state.current} size="small">
            <Step title="选择文件" />
            <Step title="核对字段" />
            <Step title="完成" />
          </Steps>
          {this.state.current === 0 && this.renderUpload()}
          {this.state.current === 1 && this.renderSchema()}
          {this.state.current === 2 && this.renderResultForm()}
        </Card>
      </React.Fragment>
    );
  }
}

export default Form.create({})(FileDataSourceConfig);