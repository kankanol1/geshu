import React, { PureComponent } from 'react';
import { Button, Upload, Icon, message, Form, Modal, Radio } from 'antd';
import fetch from 'dva/fetch';
import PropTypes from 'prop-types';
import urls from '../../utils/urlUtils';
import { wrapOptions } from '../../utils/request';
import { RenameList } from './RenameList';

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
    renameList: undefined,
    renaming: true,
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
      // do not pass these if not exist
      if (values.policy) {
        formData.append('policy', values.policy);
      }
      if (values.renameList) {
        values.renameList.forEach(n => {
          formData.append('renameList.origin', n.origin);
          formData.append('renameList.name', n.name);
        });
      }

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
          if (response && response.success) {
            this.setState({
              uploading: false,
            });
            message.success('上传成功');
            if (onOk) {
              onOk();
            }
          } else if (response && response.nameConflict) {
            this.setState({
              uploading: false,
              renameList: response.renameList,
            });
            message.error(`上传失败!请重试, 失败详情: ${response && response.message}`);
          } else {
            this.setState({
              uploading: false,
            });
            message.error(`上传失败!请重试, 失败详情: ${response && response.message}`);
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

  renderRenameList = (renameList, renaming, getFieldDecorator, formItemLayout) => {
    return (
      <React.Fragment>
        <FormItem {...formItemLayout} label="上传策略">
          {getFieldDecorator('policy', {
            initialValue: 'RENAME',
          })(
            <Radio.Group
              onChange={v => {
                this.setState({ renaming: v.target.value !== 'OVERRIDE' });
              }}
              buttonStyle="solid"
            >
              <Radio.Button value="RENAME">重命名</Radio.Button>
              <Radio.Button value="OVERRIDE">覆盖现有文件</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        {renaming && (
          <FormItem {...formItemLayout} label="重命名">
            {getFieldDecorator('renameList', {
              initialValue: renameList,
              rules: [{ type: 'array', required: true, message: '文件名列表不能为空' }],
            })(<RenameList />)}
          </FormItem>
        )}
      </React.Fragment>
    );
  };

  render() {
    const { uploading, renaming, renameList } = this.state;
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
          {renameList &&
            this.renderRenameList(renameList, renaming, getFieldDecorator, formItemLayout)}
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
