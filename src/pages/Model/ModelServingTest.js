import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Input, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import InputSchemaForm from './InputSchemaSimpleForm';
import ModelTestComponent from './ModelTestComponent';

const { TextArea } = Input;

export default class ModelServingTest extends Component {
  render() {
    return (
      <PageHeaderLayout
        breadcrumbList={[
          {
            title: '首页',
            href: '/',
          },
          {
            title: '模型服务',
            href: '/models/serving',
          },
          {
            title: '模型测试',
          },
        ]}
      >
        <ModelTestComponent id={this.props.match.params.id} />
      </PageHeaderLayout>
    );
  }
}
