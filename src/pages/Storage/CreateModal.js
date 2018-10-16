import React, { PureComponent } from 'react';
import { Button, Input, Icon, message, Form, Modal } from 'antd';
import fetch from 'dva/fetch';
import PropTypes from 'prop-types';
import urls from '../../utils/urlUtils';
import { wrapOptions } from '../../utils/request';

const FormItem = Form.Item;

@Form.create()
class CreateModal extends PureComponent {
  static defaultProps = {
    onOk: undefined,
    onCancel: undefined,
  };

  state = {
    loading: false,
  };

  handleSubmit = () => {
    const { onOk, form, type, projectId, path } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const formJson = {
        ...values,
        type,
        projectId,
        path,
      };
      this.setState({
        loading: true,
      });

      // upload.
      fetch(
        `${urls.fsMkdirUrl}`,
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
            message.error(`创建失败, 失败详情: ${response.message}`);
          }
        })
        .catch(e => {
          this.setState({
            loading: false,
          });
          message.error(`创建出错: ${e.name}`);
        });
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
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        visible={this.props.visible}
        onCancel={() => this.handleCancel()}
        title={loading ? '文件夹创建中...' : '创建文件夹'}
        closable={!loading}
        destroyOnClose
        maskClosable={false}
        footer={[
          <Button key="back" onClick={() => this.handleCancel()} disabled={loading}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => this.handleSubmit()}>
            创建
          </Button>,
        ]}
      >
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="文件夹名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入文件名',
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

CreateModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  type: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  projectId: PropTypes.number.isRequired,
};

export default CreateModal;
