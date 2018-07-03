import React from 'react';
import { Form, Input, Select, DatePicker, Modal, Row, Col } from 'antd';

const FormItem = Form.Item;


/** the creation form. */

const QueryVariableFrom = Form.create()((props) => {
  const { variableConfirm, form, handleVariableConfirmHide, handleVariableConfirmOk } = props;
  const { variableListAll, variableRepeat } = props;
  let newVariable = {};
  variableListAll.map((item, index) => {
    newVariable[item.variableName] = item.variableDesc;
    return newVariable;
  });
  variableRepeat.map((item, index) => {
    newVariable[item] = '';
    return newVariable;
  });
  const items = [];
  for (const key in newVariable) {
    if (key) {
      items.push(
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15, offset: 1 }}
          label={key}
          key
        >
          {form.getFieldDecorator(key, {
          rules: [{ required: true, message: '请填写属性值' }],
          initialValue: newVariable[key],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      );
    }
  }
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      newVariable = fieldsValue;
      handleVariableConfirmOk(fieldsValue);
    });
  };
  return (
    <Modal
      title="请确认变量"
      visible={variableConfirm}
      onOk={okHandle}
      onCancel={() => { handleVariableConfirmHide(); }}
    >
      <div style={{ maxHeight: 300, overflowY: 'scroll' }}>
        {
          items.map((node, index) => {
            return node;
          })
        }
      </div>
    </Modal>
  );
});

export default QueryVariableFrom;
