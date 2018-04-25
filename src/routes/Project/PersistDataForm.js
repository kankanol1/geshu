import React from 'react';
// import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Modal, Card, Icon, Button, Row, Col, Spin, Table, Select } from 'antd';
import { buildTagSelect } from '../../utils/uiUtils';
import styles from './WorkspaceDataView.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
/** the persist form. */

const PersistDataForm = Form.create()((props) => {
  const { handleModalVisible, persistSelectSql, form } = props;
  const { selectItem, dispatch, modalVisible } = props;
  const okHandle = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formData = { ...fieldsValue, projectId: selectItem.projectId, jobId: selectItem.jobId };
      dispatch({
        type: 'dataquery/persistQuery',
        payload: formData,
      });
      handleModalVisible(false);
      // persistSelectSql(fieldsValue);
    });
  };

  return (
    <Modal
      title="打开项目"
      visible={modalVisible}
      onOk={e => okHandle(e)}
      onCancel={() => { handleModalVisible(); }}
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
        })(
          <Input placeholder="请输入" />
        )}
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
        })(
          <Input placeholder="请输入" />
        )}
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
            <Option value="">请选择</Option>
            <Option value="true">已公开</Option>
            <Option value="false">未公开</Option>
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
        })(
          <TextArea placeholder="请输入" rows={2} />
        )}
      </FormItem>
    </Modal>
  );
});

export default PersistDataForm;
