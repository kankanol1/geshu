import React from 'react';
import { Card, Col, Row, Input, Spin } from 'antd';
import InputSchemaForm from './InputSchemaSimpleForm';
import { queryModelDetails, executeModel } from '../../services/modelsAPI';

const { TextArea } = Input;

export default class ModelTestComponent extends React.PureComponent {
  state={
    model: {},
    result: {},
    loading: true,
  }
  componentWillMount() {
    // fetch model details.
    this.fetchModelInfo(this.props.id);
  }

  componentWillUnmount() {
    // clear model.
  }

  fetchModelInfo = (id) => {
    this.setState({ loading: true });
    queryModelDetails(id).then((response) => {
      if (response) {
        this.setState({ loading: false, model: response });
      }
    });
  }

  submitSchema(fieldsValue) {
    this.setState({ loading: true });
    executeModel(this.props.id, fieldsValue).then((response) => {
      if (response) {
        this.setState({ loading: false, result: response });
      }
    });
  }

  renderTestForm() {
    const { servingSchema } = this.state.model;
    if (servingSchema) {
      return (
        <InputSchemaForm
          dispatch={this.props.dispatch}
          schema={servingSchema}
          onSubmit={e => this.submitSchema(e)}
        />
      );
    }
    return <Spin />;
  }

  render() {
    const { result, loading } = this.state;
    return (
      <Card>
        <Row>
          <Col span={12}>
            {this.renderTestForm()}
          </Col>
          <Col span={12}>
            { loading ? <Spin /> : (
              <Row>
                <Col span={4}>
                  <label htmlFor="label">返回结果</label>
                </Col>
                <Col span={20}>
                  <TextArea id="label" value={`${result.result === undefined ? '' : result.result}`} rows={10} disabled />
                </Col>
              </Row>)
            }
          </Col>
        </Row>
      </Card>
    );
  }
}
