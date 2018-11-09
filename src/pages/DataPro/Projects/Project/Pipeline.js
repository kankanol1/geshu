import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  loading: loading.models.dataproProject,
}))
class Pipeline extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <div>Pipeline</div>
      </React.Fragment>
    );
  }
}

export default Pipeline;
