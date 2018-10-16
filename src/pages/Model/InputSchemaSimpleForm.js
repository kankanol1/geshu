import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

const defaultValueForType = {
  boolean: false,
  short: 0,
  byte: '',
  int: 0,
  long: 0,
  float: 0.0,
  double: 0.0,
  string: '',
  byte_string: '',
};

@Form.create()
class InputSchemaSimpleForm extends React.Component {
  render() {
    const { form, schema } = this.props;
    const { getFieldDecorator } = form;
    // {parsedSchema.fields.map(i => <p key={i}>{i.name}</p>)}
    const renderFields = schema || [];
    const generateJson = {};
    renderFields.forEach(i => {
      generateJson[i.name] = defaultValueForType[i.type];
    });
    return (
      <Form
        onSubmit={e => {
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
        <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 19 }} label="请求内容">
          {getFieldDecorator('value', {
            rules: [{ required: true, message: '请求参数不能为空' }],
            initialValue: JSON.stringify(generateJson),
          })(<TextArea rows={10} placeholder="请输入请求参数" />)}
        </FormItem>
        <Row>
          <Col span={8} />
          <Col span={4}>
            <Button type="primary" htmlType="submit">
              执行
            </Button>
          </Col>
          <Col span={4}>
            <Button
              type="danger"
              onClick={e => {
                form.resetFields();
                this.props.dispatch({
                  type: 'modeltest/resetResult',
                });
              }}
            >
              清空
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default InputSchemaSimpleForm;
