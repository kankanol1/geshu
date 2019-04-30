import React from 'react';
import { Form, Input, Col, Row, Button } from 'antd';

import styles from './PublishIndex.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class PublishDescribe extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    const { form, next } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      next(fieldsValue);
    });
  }

  render() {
    const { form, back } = this.props;
    return (
      <React.Fragment>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '模版名称不能为空' }],
          })(<Input placeholder="模版名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
          {form.getFieldDecorator('description', {
            // rules: [{ required: true, message: '模版描述不能为空' }],
          })(<TextArea placeholder="模版描述" rows={2} />)}
        </FormItem>
        <div className={styles.btnWrapper}>
          <Button onClick={e => back()}>上一步</Button>
          <Button type="primary" onClick={e => this.handleSubmit(e)}>
            下一步
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default PublishDescribe;
