import React from 'react';
import { Row, Col, Card, Form, Input, Modal, Select, Spin, message } from 'antd';

import {
  queryAllDatasets,
  addOperator,
  updateOperator,
  queryAllObjectiveSchemas,
} from '@/services/datapro/pipelineAPI';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class InputOutputConfig extends React.Component {
  state = {
    datasetLoading: true,
    schemaLoading: true,
    datasets: [],
    schemas: [],
    adding: false,
  };

  componentDidMount() {
    queryAllDatasets({ id: this.props.projectId }).then(response => {
      this.setState({ datasetLoading: false, datasets: response || [] });
    });
    queryAllObjectiveSchemas({ id: this.props.projectId }).then(response => {
      this.setState({ schemaLoading: false, schemas: response || [] });
    });
  }

  handleOk(e, callback) {
    e.preventDefault();
    const { type } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ adding: true });
        const { projectId, code, componentId: id } = this.props;
        // send request.
        const handleResponse = response => {
          if (response) {
            if (response.success) callback(response.data);
            else {
              message.error(response.message);
            }
          }
        };
        if (type === 'new') {
          addOperator({ ...values, code, projectId }).then(response => {
            this.setState({ adding: false }, () => handleResponse(response));
          });
        } else if (type === 'modify') {
          // TODO update.
          updateOperator({ ...values, id, code, projectId }).then(response => {
            this.setState({ adding: false }, () => handleResponse(response));
          });
        } else {
          console.error('no type specified! expected `new` or `modify`'); // eslint-disable-line
        }
      }
    });
  }

  renderInputs = (inputs, data, schemas, initInputs) => {
    const { getFieldDecorator } = this.props.form;
    // inputs: {labelCol, wrapperCol, label, }
    return (
      <React.Fragment>
        <FormItem>
          {getFieldDecorator('input.0', {
            rules: [{ required: true, message: '请选择' }],
            initialValue: initInputs[0],
          })(
            <Select placeholder="请选择目标模式">
              {schemas.map(d => (
                <Option value={d} key={d}>
                  {d}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('input.1', {
            rules: [{ required: true, message: '请选择' }],
            initialValue: initInputs[1],
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
      </React.Fragment>
    );
  };

  renderOutputs = (outputs, initOutputs) => {
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <FormItem>
          {getFieldDecorator('output.0', {
            rules: [{ required: true, message: '请输入' }],
            initialValue: initOutputs[0],
          })(<Input placeholder="请输入输出数据集名称" />)}
        </FormItem>
      </React.Fragment>
    );
  };

  renderCardView = (inputs, outputs, datasets, schemas, initInputs, initOutputs) => {
    return (
      <Row>
        <Col span={12}>
          <Card title="输入数据集">{this.renderInputs(inputs, datasets, schemas, initInputs)}</Card>
        </Col>
        <Col span={12}>
          <Card title="输出数据集">{this.renderOutputs(outputs, initOutputs)}</Card>
        </Col>
      </Row>
    );
  };

  render() {
    const {
      title,
      name,
      onOk,
      onCancel,
      inputs,
      outputs,
      initInputs,
      initOutputs,
      type,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { schemaLoading, datasetLoading, datasets, adding, schemas } = this.state;

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
        <Spin spinning={schemaLoading || datasetLoading}>
          <Form>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} key="name" label="组件名称">
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [{ required: true, message: '请输入' }],
              })(<Input placeholder="组件名称" />)}
            </FormItem>
            <Row>
              {this.renderCardView(inputs, outputs, datasets, schemas, initInputs, initOutputs)}
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default InputOutputConfig;
