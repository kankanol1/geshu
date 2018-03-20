
import React from 'react';
import { Table } from 'antd';

const columns = [{
  title: 'ColumnName',
  dataIndex: 'columnName',
}, {
  title: '类型',
  dataIndex: 'columnType',
}];

export default class TableWidget extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      data: [
        { columnName: 'a', type: 'unknown' },
        { columnName: 'b', type: 'unknown' },
        { columnName: 'c', type: 'unknown' },
        { columnName: 'a', type: 'unknown' },
        { columnName: 'b', type: 'unknown' },
        { columnName: 'c', type: 'unknown' },
        { columnName: 'a', type: 'unknown' },
        { columnName: 'b', type: 'unknown' },
        { columnName: 'c', type: 'unknown' },
        { columnName: 'a', type: 'unknown' },
        { columnName: 'b', type: 'unknown' },
        { columnName: 'c', type: 'unknown' },
      ],
    };
  }

  render() {
    const maxHeight = this.props.height || 200;
    return (
      <Table columns={columns} dataSource={this.state.data} size="small" pagination={false} scroll={{ y: maxHeight }} />
    );
  }
}
