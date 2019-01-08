import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'dva';

@connect(({ dataproPreviewTable, loading }) => ({
  dataproPreviewTable,
  loading: loading.models.dataproPreviewTable,
}))
class PreviewTable extends React.PureComponent {
  // fetch config.
  state = {
    page: 0,
    size: 100,
  };

  componentDidMount() {
    // init.
    const { id, opId, configs } = this.props;
    this.props.dispatch({
      type: 'dataproPreviewTable/preview',
      payload: {
        id,
        component: opId,
        ...this.state,
      },
    });
  }

  render() {
    const { loading, dataproPreviewTable } = this.props;
    const { result } = dataproPreviewTable;
    const { data, columns } = result;
    return <ReactTable loading={loading} data={data} columns={columns} />;
  }
}

export default PreviewTable;
