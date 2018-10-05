import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const FormItem = Form.Item;

@Form.create()
export default class InputSchemaForm extends React.Component {
  render() {
    const { form, schema } = this.props;
    const { getFieldDecorator } = form;
    // {parsedSchema.fields.map(i => <p key={i}>{i.name}</p>)}
    let renderFields = schema.fields || schema;
    if (renderFields.length === 3) {
      renderFields = renderFields.filter(i => i.name !== 'label');
    }
    return (
      <Form onSubmit={(e) => {
        e.preventDefault();
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          this.props.onSubmit(fieldsValue);
        });
      }}
      >
        <Row gutter={24}>
          {
          renderFields.map((i, k) => (
            <Col
              span={12}
              key={k}
            >
              <FormItem
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
            </Col>
          ))
        }
        </Row>
        <Row>
          <Col span={8} />
          <Col span={4}>
            <Button type="primary" htmlType="submit">执行</Button>
          </Col>
          <Col span={4}>
            <Button
              type="danger"
              onClick={(e) => {
                form.resetFields();
                this.props.dispatch({
                  type: 'modeltest/resetResult',
                });
              }}
            >清空
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
