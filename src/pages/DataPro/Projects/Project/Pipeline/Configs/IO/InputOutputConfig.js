import React from 'react';
import { Row, Col, Card, Form, Input, Modal, Select, Spin } from 'antd';

import { queryAllDatasets, addOperator } from '@/services/datapro/pipelineAPI';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class InputOutputConfig extends React.Component {
  state = {
    loading: true,
    datasets: [],
    adding: false,
  };

  componentDidMount() {
    queryAllDatasets({ id: this.props.id }).then(response => {
      this.setState({ loading: false, datasets: response || [] });
    });
  }

  handleOk(e, callback) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ adding: true });
        // send request.
        addOperator({ ...values, code: this.props.code, projectId: this.props.id }).then(
          response => {
            this.setState({ adding: false }, callback(response.data));
          }
        );
      }
    });
  }

  renderInputs = (inputs, data) => {
    const { getFieldDecorator } = this.props.form;
    // inputs: {labelCol, wrapperCol, label, }
    return (
      <React.Fragment>
        {inputs.map(i => {
          const { name, ...rest } = i;
          return (
            <FormItem {...rest} key={name}>
              {getFieldDecorator(name, {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择输入数据集">
                  {data.map(d => (
                    <Option value={d} key={d}>
                      {d}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          );
        })}
      </React.Fragment>
    );
  };

  renderOutputs = outputs => {
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        {outputs.map(i => {
          const { name, ...rest } = i;
          return (
            <FormItem {...rest} key={name}>
              {getFieldDecorator(name, {
                rules: [{ required: true, message: '请输入' }],
              })(<Input placeholder="请输入输出数据集名称" />)}
            </FormItem>
          );
        })}
      </React.Fragment>
    );
  };

  renderCardView = (inputs, outputs, datasets) => {
    return (
      <Row>
        <Col span={12}>
          <Card title="输出数据集">{this.renderInputs(inputs, datasets)}</Card>
        </Col>
        <Col span={12}>
          <Card title="输出数据集">{this.renderOutputs(outputs)}</Card>
        </Col>
      </Row>
    );
  };

  render() {
    const { title, name, onOk, onCancel, inputs, outputs } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loading, datasets, adding } = this.state;
    let col = 0;
    if (inputs && inputs.length > 0) col++;
    if (outputs && outputs.length > 0) col++;

    return (
      <Modal
        title={title}
        visible
        width={800}
        maskClosable={false}
        okButtonDisabled={adding}
        cancelButtonDisabled={adding}
        closable={!adding}
        onOk={e => this.handleOk(e, onOk)}
        onCancel={() => onCancel()}
      >
        <Spin spinning={loading}>
          <Form>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} key="name" label="组件名称">
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [{ required: true, message: '请输入' }],
              })(<Input placeholder="组件名称" />)}
            </FormItem>
            <Row>
              {col === 2 && this.renderCardView(inputs, outputs, datasets)}
              {col === 1 && inputs && this.renderInputs(inputs, datasets)}
              {col === 1 && outputs && this.renderOutputs(outputs)}
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default InputOutputConfig;
