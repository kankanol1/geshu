import React from 'react';
import { Form, Input, Col, Row, Button } from 'antd';

import styles from './PublishIndex.less';

const FormItem = Form.Item;
const { TextArea } = Input;

export const renderDescriber = (v, i, form, initValues) => {
  return (
    <React.Fragment key={i}>
      <Row>
        <Col span={15} offset={5}>
          <div className={styles.describer}>描述数据集 [{v.name}]</div>
          <div className={styles.describerPadding} />
        </Col>
      </Row>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator(`${v.id}.name`, {
          rules: [{ required: true, message: '请输入名称' }],
          initialValue: initValues && initValues[v.id] && initValues[v.id].name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator(`${v.id}.description`, {
          rules: [{ required: true, message: '请输入描述' }],
          initialValue: initValues && initValues[v.id] && initValues[v.id].description,
        })(<TextArea placeholder="请输入" rows={2} />)}
      </FormItem>
    </React.Fragment>
  );
};
