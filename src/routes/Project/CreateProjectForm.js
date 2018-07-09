import React from 'react';
import { Form, Input, Button, DatePicker, Modal } from 'antd';
import { buildTagSelect } from '../../utils/uiUtils';

const FormItem = Form.Item;
const { TextArea } = Input;


/** the creation form. */
@Form.create()
export default class CreateProjectForm extends React.Component {
  state = { loading: false };

  performAdd = (fieldsValue) => {
    const { dispatch, labels, onOk, form } = this.props;
    const newLabels = fieldsValue.labels
      && fieldsValue.labels.map((l) => {
        const intL = parseInt(l, 10);
        if (!isNaN(intL)) {
          return labels[intL];
        }
        return l;
      });
    this.setState({ loading: true });
    dispatch({
      type: 'project/createProject',
      payload: {
        ...fieldsValue,
        labels: newLabels && newLabels.join(),
      },
      callback: (id) => {
        this.setState({ loading: false });
        form.resetFields();
        if (onOk) onOk(id);
      },
    });
  };

  performUpdate = (fieldsValue, oldRecord) => {
    const { dispatch, labels, form, onOk } = this.props;
    const newLabels = fieldsValue.labels
      && fieldsValue.labels.map((l) => {
        const intL = parseInt(l, 10);
        if (!isNaN(intL)) {
          return labels[intL];
        }
        return l;
      });

    this.setState({ loading: true });
    dispatch({
      type: 'project/updateProject',
      payload: {
        ...fieldsValue,
        labels: newLabels && newLabels.join(),
        id: oldRecord.id,
      },
      callback: () => {
        this.setState({ loading: false });
        form.resetFields();
        if (onOk) onOk();
      },
    });
  };

  handleOk = () => {
    const { currentRecord, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (currentRecord) {
        this.performUpdate(fieldsValue, currentRecord);
      } else {
        this.performAdd(fieldsValue);
      }
    });
  };

  render() {
    const { modalVisible, form, onOk, onCancel } = this.props;
    const { labels, currentRecord } = this.props;
    const { loading } = this.state;
    const performCancel = () => { if (onCancel) onCancel(); };
    return (
      <Modal
        title={currentRecord === undefined ? '新建项目' : '编辑项目'}
        visible={modalVisible}
        closable={!loading}
        destroyOnClose
        onCancel={performCancel}
        footer={
          [
            <Button key="back" onClick={performCancel} disabled={loading}>取消</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={() => this.handleOk()}>
              确定
            </Button>,
          ]
        }
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="名称"
        >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '项目名称' }],
            initialValue: currentRecord === undefined ? '' : currentRecord.name,
          })(
            <Input placeholder="请输入" disabled={loading} />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="描述"
        >
          {form.getFieldDecorator('description', {
            rules: [{ required: true, message: '项目描述' }],
            initialValue: currentRecord === undefined ? '' : currentRecord.description,
          })(
            <TextArea placeholder="请输入" rows={2} disabled={loading} />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="标签"
        >
          {form.getFieldDecorator('labels', {
            initialValue: currentRecord === undefined ? [] : currentRecord.labels,
          })(
            buildTagSelect(labels, true, loading)
          )}
        </FormItem>
      </Modal>
    );
  }
}

