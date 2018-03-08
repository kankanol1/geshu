/**
 * the form for settings display.
 */

import React, { Fragment } from 'react';
import { Form, Row, Col, Input, Button, Affix, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

@Form.create()
export default class ComponentSettingsForm extends React.PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (onSubmit !== undefined) {
        onSubmit(fieldsValue);
      }
    });
  }

  renderFormItem = (key, value) => {
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem
        {...formItemLayout}
        label={key}
        key={key}
      >
        {
          getFieldDecorator(key, {
            rules: [{
              required: value.required,
              message: `${key}不能为空`,
            }],
          })(
            <Input placeholder={key} />
          )
        }
      </FormItem>
    );
  }

  render() {
    const { properties } = this.props;
    const propertiesElements = [];
    for (const [key, value] of Object.entries(properties)) {
      propertiesElements.push(this.renderFormItem(key, value));
    }
    return (
      <Fragment>
        <Scrollbars style={{ height: 'calc( 100% - 88px)' }}>
          <Form onSubmit={this.handleSubmit} {...this.props}>
            { propertiesElements }
          </Form>
        </Scrollbars>
        <Affix offsetBottom={10} style={{ height: '46px', textAlign: 'center', background: '#fafafa' }}>
          <Button style={{ margin: '5px 10px' }} type="primary" htmlType="submit"> <Icon type="save" />保存 </Button>
          <Button style={{ margin: '5px 10px' }} type="danger"> <Icon type="sync" />重置 </Button>
        </Affix >
      </Fragment>
    );
  }
}
