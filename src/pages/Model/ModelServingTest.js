import React, { Component } from 'react';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import ModelTestComponent from './ModelTestComponent';

export default class ModelServingTest extends Component {
  render() {
    return (
      <PageHeaderWrapper
        breadcrumbList={[
          {
            href: '/',
            name: '首页',
            title: '首页',
          },
          {
            name: '模型管理',
            title: '首页',
          },
          {
            name: '模型服务',
            title: '首页',
            href: '/models/serving',
          },
          {
            name: '模型测试',
            title: '首页',
          },
        ]}
      >
        <ModelTestComponent id={this.props.match.params.id} />
      </PageHeaderWrapper>
    );
  }
}
