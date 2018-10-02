import React from 'react';
import { connect } from 'dva';
import { Menu, Spin, Modal, Progress, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';

@connect(
  ({ pipeline_submit }) => ({ pipeline_submit })
)
export default class SubmitPipelineModal extends React.Component {
  handleSubmitPipelineModalOk() {
    this.handleSubmitPipelineModalCancel();
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/project/workspace/output/${this.props.id}`));
  }

  handleSubmitPipelineModalCancel() {
    this.props.dispatch({
      type: 'pipeline_submit/dismiss',
    });
  }

  render() {
    const { loading, visible, result } = this.props.pipeline_submit;
    return (
      <Modal
        title={loading ? '提交中' : '提交结果'}
        visible={visible}
        okText="跳转至作业管理"
        cancelText="知道了"
        onCancel={() => this.handleSubmitPipelineModalCancel()}
        style={{ textAlign: 'center' }}
        maskClosable={false}
        footer={
          loading ? null : [
            <Button key="back" onClick={() => this.handleSubmitPipelineModalCancel()} disabled={loading}>知道了</Button>,
            result.success ? (
              <Button key="submit" type="primary" loading={loading} onClick={() => this.handleSubmitPipelineModalOk()}>
                查看项目输出
              </Button>)
              : undefined,
          ]
        }
      >
        {
          loading
            ? <Spin size="large" />
            : (result.success ? (
              <div>
                <Progress type="circle" percent={100} width={40} style={{ marginRight: '20px' }} />
                <span>
作业ID:
                  {' '}
                  {result.jobId}
                </span>
              </div>
            ) : (
              <div>
                <Progress type="circle" percent={100} width={40} status="exception" style={{ marginRight: '20px' }} />
                <span>
错误信息:
                  {' '}
                  {result.message}
                </span>
              </div>
            ))
        }
      </Modal>
    );
  }
}
