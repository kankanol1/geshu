import React from 'react';
import { Form, Input, InputNumber, Button, Icon } from 'antd';

const FormItem = Form.Item;
const GraphExploreSearchForm = Form.create()((props) => {
  const { getFieldDecorator } = props.form;
  return (
    <Form layout="inline">
      <FormItem
        label="主节点"
      >
        {getFieldDecorator('start', {
            rules: [{ required: true, message: '请输入主节点名称！' }],
          })(
            <Input
              placeholder="主节点"
              style={{ width: 200 }}
            />
            )}
      </FormItem>
      <FormItem
        label="从节点"
      >
        {getFieldDecorator('end', {
            rules: [{ message: '请输入从节点名称！' }],
          })(
            <Input
              placeholder="从节点"
              style={{ width: 200 }}
            />
            )}
      </FormItem>
      <FormItem
        label="跳数"
      >
        {getFieldDecorator('hop', {
            initialValue: 4,
          })(
            <InputNumber min={2} max={10} />
          )}
      </FormItem>
      <FormItem>
        <Button
          disabled={props.disabled}
          type="primary"
          onClick={() => {
                props.form.validateFields((err, values) => {
                    if (err) {
                      return;
                    }
                    props.onSave(values);
                  });
            }}
        >
          <Icon type="search" />
            搜索
        </Button>
      </FormItem>
    </Form>
  );
});

export default GraphExploreSearchForm;
