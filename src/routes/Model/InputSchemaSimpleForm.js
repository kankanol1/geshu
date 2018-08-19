import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create()
export default class InputSchemaSimpleForm extends React.Component {
  render() {
    const { form, schema } = this.props;
    const { getFieldDecorator } = form;
    // {parsedSchema.fields.map(i => <p key={i}>{i.name}</p>)}
    let renderFields = schema.fields || schema;
    if (renderFields.length === 3) {
      renderFields = renderFields.filter(i => i.name !== 'label');
    }
    const generateJson = {};
    renderFields.forEach((i) => {
      generateJson[i.name] = '';
    });
    return (
      <Form onSubmit={(e) => {
        e.preventDefault();
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const jsonStr = fieldsValue.value;
          try {
            const jsonObj = JSON.parse(jsonStr);
            this.props.onSubmit(jsonObj);
          } catch (error) {
            // eslint-disable-next-line
            alert('请求参数不符合规范');
          }
        });
      }}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="请求参数"
        >
          {getFieldDecorator('value', {
                rules: [{ required: true, message: '请求参数不能为空' }],
                initialValue: JSON.stringify(generateJson),
              })(
                <TextArea rows={10} placeholder="请输入请求参数" />
            )}
        </FormItem>
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
