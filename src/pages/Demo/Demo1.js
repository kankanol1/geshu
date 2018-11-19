import React from 'react';
import { connect } from 'dva';
import { Input, Row, Col, Button } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

/**
 * demo
 */
@connect(({ demo1 }) => ({ demo1 }))
class Demo1 extends React.Component {
  state = {
    field: undefined,
    value: undefined,
  };

  renderInput = () => {
    return (
      <Row>
        <Col span={4}>
          <Button
            type="primary"
            onClick={() =>
              this.props.dispatch({
                type: 'demo1/init',
              })
            }
          >
            Init
          </Button>
        </Col>
        <Col span={4}>
          <Input
            value={this.state.field}
            onChange={v => this.setState({ field: v.target.value })}
          />
        </Col>
        <Col span={1}>
          <span>=======</span>
        </Col>

        <Col span={4}>
          <Input
            value={this.state.value}
            onChange={v => this.setState({ value: v.target.value })}
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={() =>
              this.props.dispatch({
                type: 'demo1/fetchData',
                payload: {
                  ...this.state,
                },
              })
            }
          >
            Submit
          </Button>
        </Col>
      </Row>
    );
  };

  renderTable = () => {
    const { table, tableName } = this.props.demo1;
    return (
      <React.Fragment>
        <h1>{tableName}</h1>
        <ReactTable data={table ? table.data : []} columns={table ? table.columns : []} />
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.renderInput()}
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default Demo1;
