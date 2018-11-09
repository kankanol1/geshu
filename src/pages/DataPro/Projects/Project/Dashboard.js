import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  loading: loading.models.dataproProject,
}))
class Dashboard extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <div>Dashboard</div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
