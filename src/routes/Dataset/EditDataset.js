import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Select, Checkbox, Button, Card, Steps, Progress, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CSVDatasetForm from './Templates/CSVDatasetForm';
import DefineSchemaWidget from '../../components/JsonSchemaForm/Widgets/Schema/DefineSchemaWidget';

const FormItem = Form.Item;
const { TextArea } = Input;

const formRegistry = {
  CSV: CSVDatasetForm,
};

@Form.create()
@connect(({ dataset, loading }) => ({
  dataset,
  loading: loading.models.dataset,
}))
export default class EditDataset extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 'CSV',
      step: -1,
      formValues: undefined,
      schema: undefined,
      id: undefined,
      // loading: false,
    };
  }

  componentWillMount() {
    // get match.
    const modifyId = this.props.match.params.id;
    if (modifyId) {
      // do sth.
      this.props.dispatch({
        type: 'dataset/fetchDatasetInfoForId',
        id: modifyId,
        callback: (response) => {
          this.setState({ id: modifyId, step: 0, formValues: response });
        },
      });
    } else {
      this.setState({ step: 0 });
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'dataset/getSchema',
          payload: fieldsValue,
          callback: () => this.setState({ step: 1, formValues: fieldsValue }),
        });
      }
    });
  }

  handleSchemaDone(e) {
    e.preventDefault();
    const { formValues, schema } = this.state;
    const newValue = { ...formValues, schema: schema || this.props.dataset.create.schema.schema };
    if (this.state.id) {
      // modify
      this.props.dispatch({
        type: 'dataset/updateDataset',
        payload: { ...newValue, id: this.state.id },
        callback: () => this.setState({ step: 2 }),
      });
    } else {
      // create.
      this.props.dispatch({
        type: 'dataset/createDataset',
        payload: newValue,
        callback: () => this.setState({ step: 2 }),
      });
    }
  }

  renderBasicForm() {
    const { form, loading } = this.props;
    const type = this.state.formValues ? this.state.formValues.type : this.state.type;
    const ExtraItems = formRegistry[type];
    const formItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const currentRecord = this.state.formValues;
    return (
      <Form onSubmit={e => this.handleFormSubmit(e)} style={{ padding: '20px' }} >
        <FormItem
          {...formItemProps}
          label="数据集类型"
        >
          {form.getFieldDecorator('type', {
                rules: [{ required: true, message: '数据集类型不能为空' }],
                initialValue: type,
              })(
                <Select>
                  <Select.Option value="CSV">CSV</Select.Option>
                </Select>
              )}
        </FormItem>
        <FormItem
          {...formItemProps}
          label="名称"
        >
          {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '名称' }],
                initialValue: currentRecord ? currentRecord.name : '',
              })(
                <Input placeholder="请输入" />
              )}
        </FormItem>
        <FormItem
          {...formItemProps}
          label="是否公开"
        >
          {form.getFieldDecorator('isPublic', {
              initialValue: currentRecord ? currentRecord.isPublic || '' : '',
              valuePropName: 'checked',
            })(
              <Checkbox />
            )}
        </FormItem>
        <FormItem
          {...formItemProps}
          label="描述"
        >
          {form.getFieldDecorator('description', {
              rules: [{ required: true, message: '描述' }],
              initialValue: currentRecord ? currentRecord.description : '',
            })(
              <TextArea placeholder="请输入" rows={2} />
            )}
        </FormItem>
        <ExtraItems form={form} currentRecord={currentRecord} formItemProps={formItemProps} />
        <div >
          <Button style={{ marginLeft: 20 }} onClick={() => form.resetFields()}>重置</Button>
          <div style={{ textAlign: 'center', padding: '20px', float: 'right' }}>
            <Button type="primary" htmlType="submit" loading={loading} >下一步</Button>
          </div>
        </div>
      </Form>
    );
  }

  renderSchemaForm() {
    const { success, message, schema } = this.props.dataset.create.schema;
    const { loading } = this.props;
    return (
      <div style={{ padding: '20px' }}>
        {
        success ? (
          <DefineSchemaWidget
            formData={this.state.schema || schema}
            onChange={v => this.setState({ schema: v })}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <span style={{ color: 'red' }}>{message}
            </span>
          </div>
        )}
        <div >
          <Button onClick={() => this.setState({ step: 0 })}>返回上一步</Button>
          {success
            ? (
              <div style={{ textAlign: 'center', padding: '20px', float: 'right' }}>
                <Button type="primary" onClick={e => this.handleSchemaDone(e)} loading={loading}>下一步</Button>
              </div>
            ) : null
          }
        </div>
      </div>
    );
  }

  renderSuccessForm = (message) => {
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <Progress type="circle" percent={100} />
        <div style={{ padding: '10px' }}><span>{message}</span></div>
        <div style={{ padding: '20px' }}>
          <Button
            type="primary"
            onClick={() => {
              this.props.dispatch(routerRedux.push('/storage/dataset/index'));
            }}
          >返回列表
          </Button>
        </div>
      </div>
    );
  }

  renderFailForm = (message) => {
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <Progress type="circle" percent={100} status="exception" />
        <div style={{ padding: '10px' }}><span>{message}</span></div>
        <div style={{ padding: '20px' }}>
          <Button
            onClick={() => {
              this.setState({ step: 0 });
            }}
          >返回修改
          </Button>
        </div>
      </div>
    );
  }

  renderResultForm = () => {
    const { result } = this.props.dataset.create;
    return result.success ?
      this.renderSuccessForm(result.message) : this.renderFailForm(result.message);
  }

  renderLoading = () => {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Spin />
      </div>
    );
  }

  render() {
    return (
      <PageHeaderLayout
        breadcrumbList={[{
            title: '首页',
            href: '/',
          }, {
            title: '数据集列表',
            href: 'index',
          }, {
            title: '新建数据集',
          }]
        }
      >
        <Card>
          <Steps progressDot current={this.state.step}>
            <Steps.Step title="填写数据集信息" />
            <Steps.Step title="核对数据结构" />
            <Steps.Step title={this.state.id ? '修改完毕' : '创建完毕'} />
          </Steps>
          {this.state.step === 0 ? this.renderBasicForm() :
            this.state.step === 1 ? this.renderSchemaForm() :
            this.state.step === 2 ? this.renderResultForm() : this.renderLoading()}
        </Card>
      </PageHeaderLayout>
    );
  }
}
