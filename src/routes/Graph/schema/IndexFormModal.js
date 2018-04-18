import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Radio, Select } from 'antd';
import graphUtils from '../../../utils/graph_utils';

let nodeProps = [];
let linkProps = [];

const FormItem = Form.Item;
const IndexForm = Form.create()(
  (props) => {
    const { form, data } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Form layout="vertical">
        <FormItem label="名称" {...formItemLayout}>
          {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{ required: true, message: '请输入索引名称!' }],
            })(
              <Input />
            )}
        </FormItem>
        <FormItem label="类型" {...formItemLayout}>
          {getFieldDecorator('type', {
              initialValue: data.type ? data.type : 'node',
            })(
              <Radio.Group>
                <Radio value="node">节点</Radio>
                <Radio value="link">关系</Radio>
              </Radio.Group>
            )}
        </FormItem>
        <FormItem label="选项" {...formItemLayout}>
          {getFieldDecorator('config', {
                initialValue: data.config ? data.config : 'composite',
            })(
              <Radio.Group>
                <Radio value="composite">Composite</Radio>
                <Radio value="unique">Unique</Radio>
                <Radio value="mixed">Mixed</Radio>
              </Radio.Group>
            )}
        </FormItem>
        <FormItem label="属性" {...formItemLayout}>
          {getFieldDecorator('properties', {
            initialValue: data.properties ? data.properties : [],
            rules: [{ type: 'array', required: true, message: '请选择属性!' }],
          })(
            <Select
              mode="tags"
              placeholder="属性"
              style={{ width: '100%' }}
            >
              {

                  (form.getFieldValue('type') === 'node' ? nodeProps : linkProps)
                  .map((value, index) => {
                  return (<Select.Option key={index} value={value}>{value}</Select.Option>);
                })
                }
            </Select>
              )}
        </FormItem>
      </Form>
    );
  }
);
class IndexFormModal extends Component {
  render() {
    const diagram = graphUtils.getDiagram(this.props.diagramName);
    if (this.props.visible && diagram) {
      nodeProps = graphUtils.getNodeProps(diagram);
      linkProps = graphUtils.getLinkProps(diagram);
    }
    return (
      <Modal
        visible={this.props.visible}
        title="编辑索引"
        okText="保存"
        onCancel={this.props.onCancel}
        onOk={() => {
          this.form.validateFields((err, values) => {
              if (err) {
                return;
              }
              this.props.onSave(values);
              this.form.resetFields();
            });
        }}
      >
        <IndexForm ref={(e) => { this.form = e; }} data={this.props.data} />
      </Modal>
    );
  }
}
export default connect(({ graph_schema_editor }) => {
  return { ...graph_schema_editor };
})(IndexFormModal);
