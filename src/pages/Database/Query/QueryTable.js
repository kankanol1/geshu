import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Button, Input, Tabs, List, Table, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import SqlQueryTable from '../../SqlQueryTable';
import styles from '../DatabaseQuery.less';

class QueryTable extends Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataquery/clean',
    });
  }

  handleQuery(query, pageNum, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataquery/querySQL',
      payload: {
        query,
        pageNum,
        pageSize,
      },
    });
  }

  render() {
    const { queryResult } = this.props.dataquery;
    const { loading } = this.props;
    return (
      <Scrollbars>
        <SqlQueryTable
          onQuery={(q, p1, p2) => this.handleQuery(q, p1, p2)}
          queryResult={queryResult}
          loading={loading}
        />
      </Scrollbars>
    );
  }
}

export default connect(({ dataquery, loading }) => ({
  dataquery,
  loading: loading.models.dataquery,
}))(QueryTable);
