import React, { Component } from 'react';
import { Card, Button, Icon, Spin, Tooltip, Alert } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/sql/sql';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/addon/display/placeholder';
import styles from './index.less';

export default class SqlQueryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.sql === undefined ? '' : props.sql,
      pageNum: 0,
      pageSize: 20,
    };
  }

  componentWillReceiveProps(props) {
    if (props.sql !== undefined) {
      this.setState({ query: props.sql });
    }
  }

  fetchData(state, instance) {
    this.setState({ pageSize: state.pageSize, pageNum: state.page }, () => this.performQuery());
  }

  performQuery() {
    const { onQuery } = this.props;
    if (onQuery !== undefined && this.state.query !== '') {
      onQuery(
        this.state.query,
        this.state.pageNum,
        this.state.pageSize
      );
    }
  }

  render() {
    const { queryResult, loading, sql } = this.props;


    let displayTable = null;
    if (queryResult !== undefined && queryResult.success) {
      const { data, pagination } = queryResult;
      const columns = queryResult.meta.map((m) => {
        return { Header: m.label, accessor: m.label };
      });
      const pages = Math.ceil(pagination.total / pagination.pagesize);
      displayTable = (
        <ReactTable
          manual
          loading={loading}
          data={data}
          columns={columns}
          defaultPageSize={this.state.pageSize}
          className="-striped -highlight"
          pages={pages}
          onFetchData={(state, instance) => this.fetchData(state, instance)}
        />
      );
    }
    return (
      <React.Fragment>
        <Card>
          <CodeMirror
            value={sql}
            options={{
        lineNumbers: true,
        mode: 'text/x-hive',
        theme: 'solarized',
        placeholder: '输入查询sql',
      }}
            onChange={newValue => this.setState({ query: newValue })}
            className={styles.codemirror}
          />
          <div className={styles.buttonContainer}>
            <Button
              type="primary"
              className={styles.button}
              onClick={() => { this.setState({ pageNum: 0 }, () => this.performQuery()); }}
            >
              <Icon type="play-circle" /> 查询
            </Button>
            <Button type="danger" className={styles.button}>清空</Button>
          </div>
        </Card>
        <Card>
          {
      queryResult === undefined ?
       (loading ? <Spin /> : null)
       : (
         <React.Fragment>
           {
            queryResult.success ? displayTable :
            <Alert message={queryResult.message} type="error" showIcon className={styles.alert} />
          }
         </React.Fragment>
      )
    }
        </Card>
      </React.Fragment>
    );
  }
}
