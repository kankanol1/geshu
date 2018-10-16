import React from 'react';
import { Form, Input, Modal, Card, Icon, Button, Row, Col, Spin, Table, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
/** the persist form. */

const PersistTableForm = Form.create()(props => {
  const { handleModalVisible, form } = props;
  const { selectItem, dispatch, modalVisible, loading } = props;
  const okHandle = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formData = { ...fieldsValue, projectId: selectItem.projectId, id: selectItem.id };
      dispatch({
        type: 'dataquery/persistTable',
        payload: formData,
        callback: () => handleModalVisible(false),
      });
    });
  };

  return (
    <Modal
      title="持久化存储"
      visible={modalVisible}
      onOk={e => okHandle(e)}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        layout="inline"
        label="名称"
        style={{ display: 'flex' }}
      >
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '名称' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        layout="inline"
        label="数据表名"
        style={{ display: 'flex' }}
      >
        {form.getFieldDecorator('tableName', {
          rules: [{ required: true, message: '数据表名' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        layout="inline"
        label="是否公开"
        style={{ display: 'flex' }}
      >
        {form.getFieldDecorator('isPublic', {
          rules: [{ required: true, message: '是否公开' }],
          initialValue: '',
        })(
          <Select>
            <Option value="true">公开</Option>
            <Option value="false">不公开</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        layout="inline"
        label="描述"
        style={{ display: 'flex' }}
      >
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: '描述' }],
        })(<TextArea placeholder="请输入" rows={2} />)}
      </FormItem>
    </Modal>
  );
});

export default PersistTableForm;
