import React from 'react';
import { Modal, Spin, Button, Divider } from 'antd';
import { getModelMetricsDetails } from '../../services/modelsAPI';

export default class ModelDetailsDialog extends React.Component {
  state = {
    loading: true,
    result: undefined,
  };

  componentWillMount() {
    // fetch.
    this.fetchDisplayData(this.props.id);
  }

  componentWillReceiveProps(newProps) {
    // change id.
    if (!this.props.visible && newProps.visible && this.props.id !== newProps.id) {
      // fetch.
      this.fetchDisplayData(newProps.id);
    }
  }

  fetchDisplayData(id) {
    // skip undefinded.
    if (!id) return;
    this.setState({ loading: true });
    getModelMetricsDetails(id).then(response => {
      if (response) {
        this.setState({ loading: false, result: response });
      }
    });
  }

  renderResult = result => {
    const { data, success } = result;
    if (!data) {
      return '无相应度量数据';
    }
    return (
      <div style={{ maxHeight: '600px', overflow: 'auto' }}>
        <span>调优方法: {data.tuningMethod}</span>
        <Divider />
        <span>最优度量: {data.bestMetrics}</span>
        <Divider />
        <span>比较方法: {data.largerBetter ? '度量数值越大越好' : '度量数值越小越好'}</span>

        <Divider>最优参数列表</Divider>
        {Object.keys(data.bestParameters).map(item => {
          return (
            <React.Fragment key={item}>
              <span>
                {item}={data.bestParameters[item]}
              </span>{' '}
              <br />
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  render() {
    const { loading, result } = this.state;
    return (
      <Modal
        title="模型度量信息"
        visible={this.props.visible}
        footer={
          <Button type="primary" onClick={() => this.props.onCancel()}>
            关闭
          </Button>
        }
        onCancel={() => this.props.onCancel()}
      >
        {loading ? <Spin /> : this.renderResult(result)}
      </Modal>
    );
  }
}
