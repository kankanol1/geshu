
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';

@connect(({ datasetdetail, loading }) => ({
  datasetdetail,
  loading: loading.models.datasetdetail,
}))
export default class DetailTable extends React.Component {
  state = {
    // column widths,
    width: {},
  }
  componentWillMount() {
    const { datasetId, dispatch } = this.props;
    dispatch({
      type: 'datasetdetail/fetchHistogram',
      payload: {
        id: datasetId,
      },
    });
    dispatch({
      type: 'datasetdetail/fetchData',
      payload: {
        id: datasetId,
      },
    });
  }

  renderChartTest = (col, props) => {
    const { histogram } = this.props.datasetdetail;
    return (
      <div>
        <Chart
          height={100}
          padding={0}
          data={histogram[col]}
          width={(this.state.width[col] || 300) - 20}
        >
          {/* <Axis name="range" />
          <Axis name="count" />
          <Tooltip
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
    const { loading, datasetdetail } = this.props;
    const { histogram, tableData } = datasetdetail;
    if (loading || !tableData || !histogram) {
      return <Spin />;
    }
    const { data } = tableData;
    const cols = [];
    for (const key of Object.keys(data[0])) {
      cols.push({
        Header: props => <div><span>{key}</span>{this.renderChartTest(key.trim(), props)}</div>,
        accessor: key,
        width: 300,
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
          onResizedChange={(newResized, event) => {
            const newSizes = {};
            newResized.forEach((i) => {
              newSizes[i.id] = i.value;
            });
            this.setState({ width: { ...this.state.width, ...newSizes } });
          }}
        />
      </div>
    );
  }
}
