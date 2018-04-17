import React from 'react';
import { Form, Input, Select, DatePicker, Modal } from 'antd';
import { buildTagSelect } from '../../utils/uiUtils';

const FormItem = Form.Item;
const { TextArea } = Input;


/** the creation form. */

const CreateDatabaseForm = Form.create()((props) => {
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
      onCancel={() => { handleModalVisible(); }}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="名称"
      >
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '数据库名' }],
          initialValue: currentRecord === undefined ? '' : currentRecord.name,
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="数据表名"
      >
        {form.getFieldDecorator('tableName', {
          rules: [{ required: true, message: '数据表名' }],
          initialValue: currentRecord === undefined ? [] : currentRecord.tableName,
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="是否公开"
      >
        {form.getFieldDecorator('isPublic', {
          rules: [{ required: true, message: '数据库是否公开' }],
          initialValue: currentRecord === undefined ? '' : currentRecord.isPublic,
        })(
          <Input placeholder="请输入true或false" />
        )}
      </FormItem>
    </Modal>
  );
});

export default CreateDatabaseForm;
