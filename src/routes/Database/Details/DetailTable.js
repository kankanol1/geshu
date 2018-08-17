
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Chart, Geom } from 'bizcharts';

@connect(({ databasedetail, loading }) => ({
  databasedetail,
  loading: loading.models.databasedetail,
}))
export default class DetailTable extends React.Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'databasedetail/fetchHistogram',
    });
    this.props.dispatch({
      type: 'databasedetail/fetchData',
    });
  }

  renderChartTest = (col) => {
    const { histogram } = this.props.databasedetail;
    return (
      <div>
        <Chart height={100} padding={0} data={histogram[col]} forceFit>
          {/* <Axis name="year" />
          <Axis name="sales" /> */}
          {/* <Tooltip
            crosshairs={{
              type: 'y',
            }}
          /> */}
          <Geom type="interval" position="range*count" />
        </Chart>
      </div>
    );
  }

  render() {
    const { loading, databasedetail } = this.props;
    const { histogram, tableData } = databasedetail;
    if (loading || !tableData || !histogram) {
      return <Spin />;
    }
    const { data } = tableData;
    const cols = [];
    for (const key of Object.keys(data[0])) {
      cols.push({
        Header: () => <div><span>{key}</span>{this.renderChartTest(key)}</div>,
        accessor: key,
        width: 400,
      });
    }
    return (
      <div>
        <ReactTable
          // manual
          loading={false}
          data={data}
          columns={cols}
          // defaultPageSize={this.state.pageSize}
          defaultPageSize={10}
          className="-striped -highlight"
          // pages={pages}
          // onFetchData={(state, instance) => this.fetchData(state, instance)}
        />
      </div>
    );
  }
}
