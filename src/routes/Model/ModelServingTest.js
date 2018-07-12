import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Col, Row } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import InputSchemaForm from './InputSchemaForm';


@connect(({ modeltest }) => ({
  modeltest,
}))
export default class ModelServingTest extends Component {
  componentWillMount() {
    // fetch model details.
    this.fetchModelInfo(this.props);
  }

  componentWillUnmount() {
    // clear model.
  }

  fetchModelInfo = (props) => {
    props.dispatch({
      type: 'modeltest/fetchModelInfo',
      payload: { id: props.match.params.id },
    });
  }

  renderTestForm() {
    const { inputSchema } = this.props.modeltest.model;
    if (inputSchema) {
      const parsedSchema = JSON.parse(inputSchema);
      return (<InputSchemaForm schema={parsedSchema} />);
    }
    return null;
  }

  render() {
    return (
      <PageHeaderLayout
        breadcrumbList={[{
          title: '首页',
          href: '/',
        }, {
          title: '模型服务',
          href: '/models/serving',
        }, {
          title: '模型测试',
        }]}
      >
        <Card>
          {this.renderTestForm()}
        </Card>


      </PageHeaderLayout>
    );
  }
}
