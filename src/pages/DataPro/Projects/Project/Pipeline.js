import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Workspace from './Pipeline/Workspace';

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  loading: loading.models.dataproProject,
}))
class Pipeline extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Workspace id={this.props.match.params.id} />
      </React.Fragment>
    );
  }
}

export default Pipeline;
