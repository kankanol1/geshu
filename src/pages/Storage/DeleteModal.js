import React, { PureComponent } from 'react';
import { Button, message, Modal } from 'antd';
import fetch from 'dva/fetch';
import PropTypes from 'prop-types';
import urls from '../../utils/urlUtils';
import { wrapOptions } from '../../utils/request';

export default class DeleteModal extends PureComponent {
  static defaultProps = {
    onOk: undefined,
    onCancel: undefined,
  };

  state = {
    loading: false,
  };

  handleSubmit = () => {
    const { onOk, type, projectId, path, fileItem } = this.props;
    const formJson = {
      type,
      projectId,
      path,
      file: fileItem.rpath,
    };
    this.setState({
      loading: true,
    });

    // upload.
    fetch(
      `${urls.fsDeleteUrl}`,
      wrapOptions({
        method: 'POST',
        processData: false,
        body: formJson,
      })
    )
      .then(response => {
        if (response.status !== 200) {
          const error = new Error(response.status);
          error.name = `HTTP错误${response.status}`;
          error.response = response;
          throw error;
        } else {
          return response.json();
        }
      })
      .then(response => {
        if (response && response.success) {
          this.setState({
            loading: false,
          });
          message.success(response.message);
          if (onOk) {
            onOk();
          }
        } else {
          this.setState({
            loading: false,
          });
          message.error(`删除失败, 失败详情: ${response && response.message}`);
        }
      })
      .catch(e => {
        this.setState({
          loading: false,
        });
        message.error(`删除出错: ${e.name}`);
      });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  render() {
    const { loading } = this.state;
    const { fileItem } = this.props;
    const fileOrDir = fileItem.isdir ? '文件夹' : '文件';
    return (
      <Modal
        visible={this.props.visible}
        onCancel={() => this.handleCancel()}
        title={loading ? `${fileOrDir}删除中...` : `删除${fileOrDir}`}
        closable={!loading}
        destroyOnClose
        maskClosable={false}
        footer={[
          <Button key="back" onClick={() => this.handleCancel()} disabled={loading}>
            取消
          </Button>,
          <Button key="submit" type="danger" loading={loading} onClick={() => this.handleSubmit()}>
            删除
          </Button>,
        ]}
      >
        <div>
          确认删除
          {fileOrDir}: {fileItem.rpath} ?
        </div>
      </Modal>
    );
  }
}

DeleteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  type: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  projectId: PropTypes.number.isRequired,
  fileItem: PropTypes.object.isRequired,
};
