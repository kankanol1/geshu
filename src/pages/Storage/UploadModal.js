import React, { PureComponent } from 'react';
import { Button, Upload, Icon, message, Form, Modal } from 'antd';
import fetch from 'dva/fetch';
import PropTypes from 'prop-types';
import urls from '../../utils/urlUtils';
import { wrapOptions } from '../../utils/request';

const FormItem = Form.Item;

@Form.create()
class UploadModal extends PureComponent {
  static defaultProps = {
    onOk: undefined,
    onCancel: undefined,
  };

  state = {
    uploading: false,
    fileList: [],
  };

  handleSubmit = () => {
    const { onOk, form, type, projectId, path } = this.props;
    const { fileList } = this.state;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const formData = new FormData();
      formData.append('type', type);
      formData.append('projectId', projectId);
      formData.append('path', path);
      fileList.forEach(file => {
        formData.append('files', file);
      });

      this.setState({
        uploading: true,
      });

      // upload.
      fetch(
        `${urls.fsUploadUrl}`,
        wrapOptions({
          method: 'POST',
          processData: false,
          body: formData,
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
          if (response.success) {
            this.setState({
              uploading: false,
            });
            message.success('上传成功');
            if (onOk) {
              onOk();
            }
          } else {
            this.setState({
              uploading: false,
            });
            message.error(`上传失败!请重试, 失败详情: ${response.message}`);
          }
        })
        .catch(e => {
          this.setState({
            uploading: false,
          });
          message.error(`上传出错: ${e.name}`);
        });
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { uploading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        visible={this.props.visible}
        onCancel={() => this.handleCancel()}
        title={uploading ? '文件上传中...' : '上传文件'}
        closable={!uploading}
        destroyOnClose
        maskClosable={false}
        footer={[
          <Button key="back" onClick={() => this.handleCancel()} disabled={uploading}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={uploading}
            onClick={() => this.handleSubmit()}
          >
            确定
          </Button>,
        ]}
      >
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="上传文件">
            {getFieldDecorator('files', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              rules: [{ type: 'array', required: true, message: '请选择文件' }],
            })(
              <Upload
                beforeUpload={file => {
                  this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                  }));
                  return false;
                }}
                onRemove={file => {
                  this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                      fileList: newFileList,
                    };
                  });
                }}
              >
                <Button disabled={uploading}>
                  {uploading ? (
                    <span>
                      <Icon type="loading" />
                      上传中
                    </span>
                  ) : (
                    <span>
                      <Icon type="upload" /> 选择文件
                    </span>
                  )}
                </Button>
              </Upload>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

UploadModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  type: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  projectId: PropTypes.number.isRequired,
};

export default UploadModal;
