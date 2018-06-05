import React, { PureComponent } from 'react';
import { Button, Input, message, Form, Modal } from 'antd';
import fetch from 'dva/fetch';
import PropTypes from 'prop-types';
import urls from '../../utils/urlUtils';
import { extractFileName } from '../../utils/conversionUtils';

const FormItem = Form.Item;

@Form.create()
export default class RenameModal extends PureComponent {
  static defaultProps = {
    onOk: undefined,
    onCancel: undefined,
  }

  state = {
    loading: false,
  }

  handleSubmit = () => {
    const { onOk, form, type, projectId, path, fileItem } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const formJson = {
        ...values,
        type,
        projectId,
        path,
        oldPath: fileItem.rpath,
      };
      this.setState({
        loading: true,
      });

      // upload.
      fetch(`${urls.fsRenameUrl}`, {
        credentials: 'include',
        method: 'POST',
        processData: false,
        body: JSON.stringify(formJson),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      }).then((response) => {
        if (response.status !== 200) {
          const error = new Error(response.status);
          error.name = `HTTP错误${response.status}`;
          error.response = response;
          throw error;
        } else {
          return response.json();
        }
      }).then((response) => {
        if (response.success) {
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
          message.error(`重命名失败, 失败详情: ${response.message}`);
        }
      }).catch((e) => {
        this.setState({
          loading: false,
        });
        message.error(`重命名出错: ${e.name}`);
      });
    });
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }

  render() {
    const { loading } = this.state;
    const { fileItem, form } = this.props;
    const { getFieldDecorator } = form;
    const fileOrDir = fileItem.isdir ? '文件夹' : '文件';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        visible={this.props.visible}
        onCancel={() => this.handleCancel()}
        title={loading ? `${fileOrDir}重命名中...` : `重命名${fileOrDir}`}
        closable={!loading}
        destroyOnClose
        footer={
          [
            <Button key="back" onClick={() => this.handleCancel()} disabled={loading}>取消</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={() => this.handleSubmit()}>
              创建
            </Button>,
          ]
        }
      >
        <Form layout="horizontal">
          <FormItem
            {...formItemLayout}
            label={`原${fileOrDir}名称`}
          >
            {getFieldDecorator('oldPath', {
              initialValue: extractFileName(fileItem.rpath),
          })(
            <Input disabled />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`新${fileOrDir}名称`}
          >
            {getFieldDecorator('newName', {
              rules: [{
                required: true, message: `请输入新${fileOrDir}名`,
              }],
          })(
            <Input />
          )}
          </FormItem>

        </Form>
      </Modal>
    );
  }
}

RenameModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  type: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  projectId: PropTypes.number.isRequired,
  fileItem: PropTypes.object.isRequired,
};
