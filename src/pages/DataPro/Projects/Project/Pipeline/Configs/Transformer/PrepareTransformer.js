import React from 'react';
import { connect } from 'dva';
import { Input, Row, Col, Button, Icon } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import styles from './PrepareTransformer.less';

const history = [
  {
    id: 1,
    name: 'select',
    params: {
      columns: ['name1', 'name2', 'name3'],
    },
  },
  {
    id: 2,
    name: 'split',
    params: {
      column: 'name1',
      output: ['name4', 'name5'],
      splitBy: '-',
    },
  },
];

const names = {
  select: '列选择',
  split: '列拆分',
};

@connect(({ demo1 }) => ({ demo1 }))
class PrepareTransformer extends React.Component {
  state = {
    field: undefined,
    value: undefined,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'demo1/fetchData',
      payload: {
        ...this.state,
      },
    });
  }

  // handleClick(e) {
  //   e.preventDefault();
  //   console.log('e', e.clientX, e.clientY);
  // }

  describeHistory = item => {
    if (item.name === 'select') {
      return `${item.params.columns}`;
    } else if (item.name === 'split') {
      return `name1 => name2, name4`;
    }
  };

  renderTable = () => {
    const { table, tableName } = this.props.demo1;
    const columns = [];
    if (table) {
      for (const v of table.columns) {
        columns.push({
          id: v.accessor,
          Header: props => <span onClick={e => this.handleClick(e)}> {v.accessor}</span>,
          accessor: v.accessor,
          sortable: false,
        });
      }
    }
    return (
      <React.Fragment>
        <ReactTable data={table ? table.data : []} columns={columns} />
      </React.Fragment>
    );
  };

  renderHistory = () => {
    return (
      <React.Fragment>
        <div className={styles.historyTitle}>历史操作</div>
        <div className={styles.historyList}>
          {history.map(i => (
            <div className={styles.historyItem}>
              <div className={styles.operations}>
                <Icon type="delete" style={{ color: 'red' }} />
                <Icon type="edit" />
              </div>
              <div className={styles.title}>{names[i.name]}</div>
              <span className={styles.description}>{this.describeHistory(i)}</span>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  };

  renderContext = () => {
    return (
      <div className={styles.menuWrapper}>
        <div className={styles.menuItem}>列拆分</div>
        <div className={styles.menuItem}>应用变换</div>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col span={6}>{this.renderHistory()}</Col>
          <Col span={18}>{this.renderTable()}</Col>
        </Row>
        {this.renderContext()}
      </React.Fragment>
    );
  }
}

export default PrepareTransformer;
