import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Timeline } from 'antd';

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  loading: loading.models.dataproProject,
}))
class Versions extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Card>
          <Timeline>
            <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
            <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
            <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
            <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
          </Timeline>
        </Card>
      </React.Fragment>
    );
  }
}

export default Versions;
