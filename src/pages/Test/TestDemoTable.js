import React from 'react';
import { connect } from 'dva';
import { Input, Row, Col, Button } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const { TextArea } = Input;

@connect(({ demo }) => ({ demo }))
class DemoTable extends React.Component {
  state = {
    command: undefined,
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'demo/init',
    });
  }

  renderInput = () => {
    const { command } = this.state;
    return (
      <Row>
        <Col span={20}>
          <TextArea
            row={12}
            value={command}
            onChange={v => this.setState({ command: v.target.value })}
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={() =>
              this.props.dispatch({
                type: 'demo/execute',
                payload: command,
              })
            }
          >
            {' '}
            Submit
          </Button>
        </Col>
      </Row>
    );
  };

  renderTable = () => {
    const { table, tableName } = this.props.demo;
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

export default DemoTable;
