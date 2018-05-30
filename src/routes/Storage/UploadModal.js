import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Upload, Icon, message, Form, Modal, Radio } from 'antd';
import request from '../../utils/request';
import urls from '../../utils/urlUtils';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@Form.create()
export default class UploadModal extends PureComponent {
  state = {
    fileList: [],
    uploading: false,
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    formData.append('path', 'testfromfront.png');
    if (fileList.length === 1) {
      formData.append('file', fileList[0]);
    }

    this.setState({
      uploading: true,
    });

    // You can use any AJAX library you like
    request(urls.fsUploadUrl, {
      credentials: 'include',
      method: 'POST',
      processData: false,
      body: formData,
    }).then((response) => {
      if (response.success) {
        this.setState({
          fileList: [],
          uploading: false,
        });
        message.success('upload successfully.');
      } else {
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      }
    });
  }

  handleSubmit = () => {
    const { onOk } = this.props;

    if (onOk) {
      onOk();
    }
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const { uploading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const uploadProps = {
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
      multiple: false,
      withCredentials: true,
    };

    return (
      <Modal
        visible={this.props.visible}
        onCancel={() => this.handleCancel()}
        onOk={() => this.handleSubmit()}
        title="上传文件"
      >
        <div>
          <Form layout="horizontal">

            <FormItem
              label="可见范围"
              {...formItemLayout}
            >
              {getFieldDecorator('type')(
                <RadioGroup>
                  <Radio value="private">个人可见</Radio>
                  <Radio value="public">公开可见</Radio>
                  <Radio value="project">项目可见</Radio>
                </RadioGroup>
          )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="上传文件"
            >
              {getFieldDecorator('files', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              ...uploadProps,
          })(
            <Upload beforeUpload={(file) => {
              this.setState(({ fileList }) => ({
                fileList: [...fileList, file],
              }));
              return false;
            }}
            >
              <Button>
                <Icon type="upload" /> 选择文件
              </Button>
            </Upload>
          )}
            </FormItem>

          </Form>


          <Upload {...uploadProps}>
            <Button>
              <Icon type="upload" /> 选择文件
            </Button>
          </Upload>
          <Button
            className="upload-demo-start"
            type="primary"
            onClick={this.handleUpload}
            disabled={this.state.fileList.length === 0}
            loading={uploading}
          >
            {uploading ? 'Uploading' : 'Start Upload' }
          </Button>
        </div>
      </Modal>
    );
  }
}
