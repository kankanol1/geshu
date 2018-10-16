import React from 'react';
import { Card, Col, Row, Input, Spin, Switch, Table } from 'antd';
import { queryModelDetails, executeModel } from '../../services/modelsAPI';
import InputSchemaSimpleForm from './InputSchemaSimpleForm';
import InputSchemaForm from './InputSchemaForm';

const { TextArea } = Input;

export default class ModelTestComponent extends React.PureComponent {
  state = {
    model: {},
    result: {},
    loading: true,
    formInput: true,
  };

  componentWillMount() {
    // fetch model details.
    this.fetchModelInfo(this.props.id);
  }

  componentWillUnmount() {
    // clear model.
  }

  fetchModelInfo = id => {
    this.setState({ loading: true });
    queryModelDetails(id).then(response => {
      if (response) {
        this.setState({ loading: false, model: response });
      }
    });
  };

  submitSchema(fieldsValue) {
    this.setState({ loading: true });
    executeModel(this.props.id, fieldsValue).then(response => {
      if (response) {
        this.setState({ loading: false, result: response });
      }
    });
  }

  renderTestForm(formInput) {
    const { servingSchema } = this.state.model;
    if (servingSchema) {
      if (formInput) {
        return (
          <InputSchemaForm
            dispatch={this.props.dispatch}
            schema={servingSchema}
            onSubmit={e => this.submitSchema(e)}
          />
        );
      } else {
        return (
          <InputSchemaSimpleForm
            dispatch={this.props.dispatch}
            schema={servingSchema}
            onSubmit={e => this.submitSchema(e)}
          />
        );
      }
    }
    return <Spin />;
  }

  // renderSimpleResult = (result) => {
  //   return (
  //     <TextArea
  //       id="label"
  //       value={`${result.data === undefined ? '' : result.data}`}
  //       rows={10}
  //       disabled
  //     />
  //   );
  // }

  renderResult = result => {
    if (!result.data) return <div>暂无数据</div>;
    const { schema, data } = result.data;
    return (
      <Table
        // className={styles.table}
        style={{ marginTop: '10px' }}
        columns={
          schema && schema.map(i => ({ width: 100, title: i.name, key: i.name, dataIndex: i.name }))
        }
        dataSource={data || []}
        scroll={{ x: schema && schema.length * 100, y: 400 }}
        pagination={false}
        loading={false}
        bordered
        size="small"
      />
    );
  };

  render() {
    const { result, loading, formInput } = this.state;
    return (
      <React.Fragment>
        <Card
          title="测试输入"
          extra={
            <Switch
              checkedChildren="表单输入"
              unCheckedChildren="json输入"
              defaultChecked={formInput}
              onChange={e => this.setState({ formInput: e })}
            />
          }
        >
          {this.renderTestForm(formInput)}
        </Card>
        <div style={{ height: '20px' }} />
        <Card title="输出结果">{loading ? <Spin /> : this.renderResult(result)}</Card>
      </React.Fragment>
    );
  }
}
