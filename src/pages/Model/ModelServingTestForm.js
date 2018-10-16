import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Input, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import InputSchemaForm from './InputSchemaForm';

const { TextArea } = Input;

@connect(({ modeltest, loading }) => ({
  modeltest,
  loading: loading.models.modeltest,
}))
class ModelServingTestForm extends Component {
  componentWillMount() {
    // fetch model details.
    this.fetchModelInfo(this.props);
  }

  componentWillUnmount() {
    // clear model.
  }

  fetchModelInfo = props => {
    props.dispatch({
      type: 'modeltest/fetchModelInfo',
      payload: { id: props.match.params.id },
    });
  };

  submitSchema(fieldsValue) {
    this.props.dispatch({
      type: 'modeltest/execute',
      payload: { params: { ...fieldsValue }, id: this.props.match.params.id },
    });
  }

  renderTestForm() {
    const { inputSchema } = this.props.modeltest.model;
    if (inputSchema) {
      const parsedSchema = JSON.parse(inputSchema);
      return (
        <InputSchemaForm
          dispatch={this.props.dispatch}
          schema={parsedSchema}
          onSubmit={e => this.submitSchema(e)}
        />
      );
    }
    return <Spin />;
  }

  render() {
    const { result } = this.props.modeltest;
    const { loading } = this.props;
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
        <Card>
          <Row>
            <Col span={12}>{this.renderTestForm()}</Col>
            <Col span={12}>
              {loading ? (
                <Spin />
              ) : (
                <TextArea
                  value={`${result.result === undefined ? '' : result.result}`}
                  rows={10}
                  disabled
                />
              )}
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default ModelServingTestForm;
