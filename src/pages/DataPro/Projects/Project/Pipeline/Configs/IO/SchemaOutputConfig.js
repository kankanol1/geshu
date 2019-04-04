import React from 'react';
import { Row, Col, Card, Form, Input, Modal, Select, Spin, message } from 'antd';

import {
  queryAllObjectiveSchemas,
  addOperator,
  updateOperator,
} from '@/services/datapro/pipelineAPI';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class SchemaOutputConfig extends React.Component {
  state = {
    loading: true,
    datasets: [],
    adding: false,
  };

  componentDidMount() {
    queryAllObjectiveSchemas({ id: this.props.projectId }).then(response => {
      this.setState({ loading: false, datasets: response || [] });
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

  renderOutputs = (outputs, initOutputs) => {
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        {outputs.map(i => {
          const { order, name, ...rest } = i;
          return (
            <FormItem {...rest} key={name}>
              {getFieldDecorator(name, {
                rules: [{ required: true, message: '请输入' }],
                initialValue: initOutputs[order],
              })(<Input placeholder="请输入输出模式名称" />)}
            </FormItem>
          );
        })}
      </React.Fragment>
    );
  };

  render() {
    const { title, name, onOk, onCancel, outputs, initOutputs, type } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loading, datasets, adding } = this.state;
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
            <Row>{this.renderOutputs(outputs, datasets, initOutputs)}</Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default SchemaOutputConfig;
