import React from 'react';
import { Spin } from 'antd';
import { getTransformationSchema } from '@/services/datapro/pipelineAPI';

export default class WithSchema extends React.PureComponent {
  state = {
    loading: true,
    error: false,
  };

  componentDidMount() {
    const { id, opId, configs } = this.props;
    getTransformationSchema({
      projectId: id,
      id: opId,
      pos: configs.length,
    }).then(response => {
      if (response) {
        if (response.success) {
          this.setState({ loading: false });
          this.props.onLoad(response.data);
        } else {
          this.setState({ error: false, loading: false });
        }
      }
    });
  }

  render() {
    const { loading, error } = this.state;
    if (loading) return <Spin />;
    if (error) {
      return <span style={{ color: 'red' }}>加载信息失败，请关闭重试</span>;
    }
    // render children with schema.
    return this.props.children || '';
  }
}
