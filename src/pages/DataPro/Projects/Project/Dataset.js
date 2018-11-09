import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  loading: loading.models.dataproProject,
}))
class Dataset extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <div>dataset</div>
      </React.Fragment>
    );
  }
}

export default Dataset;
