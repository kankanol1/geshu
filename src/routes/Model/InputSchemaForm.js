import React from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

@Form.create()
export default class InputSchemaForm extends React.Component {
  render() {
    const { form, schema } = this.props;
    const { getFieldDecorator } = form;
    // {parsedSchema.fields.map(i => <p key={i}>{i.name}</p>)}
    return (
      <Form >
        {
          schema.fields.map(i => (
            <FormItem
              key={i}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label={i.name}
            >
              {getFieldDecorator(i.name, {
                rules: [{ required: true, message: `${i.name}不能为空` }],
              })(
                <Input placeholder="请输入" />
            )}
            </FormItem>
          ))
        }
      </Form>
    );
  }
}
