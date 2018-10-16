import React from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

/** the creation form. */

const CreateProjectForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleUpdate, handleModalVisible } = props;
  const { currentRecord } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (currentRecord) {
        handleUpdate(fieldsValue, currentRecord);
        form.resetFields();
      } else {
        handleAdd(fieldsValue);
        form.resetFields();
      }
    });
  };
  return (
    <Modal
      title={currentRecord === undefined ? '新建项目' : '编辑项目'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '项目名称' }],
          initialValue: currentRecord === undefined ? '' : currentRecord.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: '项目描述' }],
          initialValue: currentRecord === undefined ? '' : currentRecord.description,
        })(<TextArea placeholder="请输入" rows={2} />)}
      </FormItem>
    </Modal>
  );
});

export default CreateProjectForm;
