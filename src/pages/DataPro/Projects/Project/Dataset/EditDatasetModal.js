import React from 'react';
import { Modal, Form, Spin, Input, message } from 'antd';
import { updateDataset } from '@/services/datapro/datasetAPI';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class EditDatasetModal extends React.PureComponent {
  state = {
    loading: false,
  };

  handleOk(e, onOk) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const { dataset } = this.props;
        updateDataset({ id: dataset.id, ...values }).then(response => {
          if (response && response.success) {
            message.info(response.message);
            onOk();
          } else {
            message.error((response && response.message) || '请求错误，请重试');
          }
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { onOk, onCancel, dataset } = this.props;
    const { loading } = this.state;
    return (
      <Modal
        title="编辑数据集信息"
        visible
        width={800}
        maskClosable={false}
        okButtonDisabled={loading}
        cancelButtonDisabled={loading}
        closable={!loading}
        onOk={e => this.handleOk(e, onOk)}
        onCancel={() => onCancel()}
      >
        <Spin spinning={loading}>
          <Form>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} key="name" label="名称">
              {getFieldDecorator('name', {
                initialValue: dataset.name,
                rules: [{ required: true, message: '不能为空' }],
              })(<Input placeholder="名称" />)}
            </FormItem>
            <FormItem
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              key="description"
              label="描述"
            >
              {getFieldDecorator('description', {
                initialValue: dataset.description,
              })(<TextArea placeholder="描述" rows={6} />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default EditDatasetModal;
