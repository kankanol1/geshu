import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Timeline, Spin } from 'antd';
import styles from './Versions.less';

const defaultParams = {
  pageSize: -1,
  currentPage: 1,
};

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  loading: loading.models.dataproProject,
}))
class Versions extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'dataproProject/fetchProjectVersions',
      payload: {
        ...defaultParams,
        id,
      },
    });
  }

  render() {
    const { versions } = this.props.dataproProject;
    const { loading } = this.props;
    return (
      <React.Fragment>
        <Card>
          <Spin spinning={loading}>
            <Timeline>
              {versions &&
                versions.list &&
                versions.list.map((i, x) => (
                  <Timeline.Item key={x}>
                    <div>
                      <span className={styles.time}>{i.time}</span>
                      <span className={styles.title}>{i.title}</span>
                    </div>
                  </Timeline.Item>
                ))}
            </Timeline>
          </Spin>
        </Card>
      </React.Fragment>
    );
  }
}

export default Versions;
