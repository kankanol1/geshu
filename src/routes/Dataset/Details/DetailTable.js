
import React, { PureComponent, Fragment } from 'react';
import { Spin } from 'antd';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { queryDatasetData, queryDatasetHistogram, queryPrivateDatasetData, queryPrivateDatasetHistogram } from '../../../services/datasetAPI';

export default class DetailTable extends React.Component {
  static defaultProps = {
    type: 'normal',
  }
  state = {
    // column widths,
    width: {},
    tableData: undefined,
    histogram: undefined,
    loading: true,
    dataLoading: true,
    pageSize: 10,
  }
  componentWillMount() {
    const { datasetId } = this.props;
    this.setState({ loading: true });
    let finishCount = 1;
    const handleLoading = () => {
      finishCount++;
      if (finishCount === 2) {
        this.setState({ loading: false });
      }
    };
    let apis = {};
    if (this.props.type === 'private') {
      apis = { queryData: queryPrivateDatasetData, queryHistogram: queryPrivateDatasetHistogram };
    } else {
      apis = { queryData: queryDatasetData, queryHistogram: queryDatasetHistogram };
    }
    const { queryData, queryHistogram } = apis;
    queryData({ id: datasetId, pageSize: this.state.pageSize, currentPage: 1 }).then((response) => {
      if (response) {
        this.setState({ tableData: response });
        handleLoading();
      }
    });
    queryHistogram({ id: datasetId }).then((response) => {
      if (response) {
        this.setState({ histogram: response });
        handleLoading();
      }
    });
  }

  fetchData(state, instance) {
    const { datasetId } = this.props;
    const { pageSize, page } = state;
    this.setState({ pageSize });
    const queryData = this.props.type === 'private' ? queryPrivateDatasetData : queryDatasetData;
    this.setState({ dataLoading: true });
    queryData({ id: datasetId,
      pageSize,
      currentPage: page + 1 }).then((response) => {
      if (response) {
        this.setState({ tableData: response, dataLoading: false });
      }
    });
  }

  renderChartTest = (col, props) => {
    const { histogram } = this.state;
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
    const { loading, histogram, tableData, dataLoading } = this.state;
    if (loading || !tableData || !histogram) {
      return <Spin />;
    }
    const { data, pagination, meta } = tableData;
    const { total, pageSize, current } = pagination;
    const pages = Math.ceil(total / pageSize);
    const cols = [];
    if (meta) {
      meta.forEach((key) => {
        cols.push({
          Header: props => (
            <div><span>{key.name}</span>
              {this.renderChartTest(key.name.trim(), props)}
            </div>
          ),
          accessor: key.name,
          width: 300,
        });
      });
    }
    return (
      <div>
        <ReactTable
          manual
          loading={dataLoading}
          data={data}
          columns={cols}
          defaultPageSize={this.state.pageSize}
          className="-striped -highlight"
          pages={pages}
          onFetchData={(state, instance) => this.fetchData(state, instance)}
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

DetailTable.propTypes = {
  datasetId: PropTypes.number.isRequired,
  type: PropTypes.string,
};
