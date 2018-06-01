import React, { PureComponent } from 'react';
import { Button, Input, message, Form, Modal } from 'antd';
import fetch from 'dva/fetch';
import PropTypes from 'prop-types';
import urls from '../../utils/urlUtils';
import { extractFileName } from '../../utils/conversionUtils';
import FilePickerForForm from './FilePickerForForm';

const FormItem = Form.Item;

@Form.create()
export default class MoveModal extends PureComponent {
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
        oldPath: {
          type,
          projectId,
          path: fileItem.rpath,
        },
        newPath: {
          ...values.newPath,
        },
      };
      this.setState({
        loading: true,
      });

      // upload.
      fetch(`${urls.fsMoveUrl}`, {
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
          message.error(`操作失败, 失败详情: ${response.message}`);
        }
      }).catch((e) => {
        this.setState({
          loading: false,
        });
        message.error(`操作出错: ${e.name}`);
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
        title={loading ? `${fileOrDir}移动中...` : `移动${fileOrDir}`}
        closable={!loading}
        destroyOnClose
        footer={
          [
            <Button key="back" onClick={() => this.handleCancel()} disabled={loading}>取消</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={() => this.handleSubmit()}>
              移动
            </Button>,
          ]
        }
      >
        <Form
          layout="horizontal"
          style={{ height: '520px' }}
        >
          <FormItem
            {...formItemLayout}
            label={`原${fileOrDir}位置`}
          >
            {getFieldDecorator('oldPath', {
              initialValue: fileItem.rpath,
          })(
            <Input disabled />
          )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="目标地址"
          >
            {getFieldDecorator('newPath', {
              rules: [{
                required: true, message: '请选择移动位置',
              }],
          })(
            <FilePickerForForm />
          )}
          </FormItem>

        </Form>
      </Modal>
    );
  }
}

MoveModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  type: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  projectId: PropTypes.number.isRequired,
  fileItem: PropTypes.object.isRequired,
};
