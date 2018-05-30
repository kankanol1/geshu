import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Upload, Icon, message } from 'antd';
import request from '../../utils/request';
import urls from '../../utils/urlUtils';

export default class StorageList extends PureComponent {
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

  render() {
    const { uploading } = this.state;
    const props = {
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
      <React.Fragment>
        <Button >FileUpload</Button>

        <div>
          <Upload {...props}>
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
      </React.Fragment>
    );
  }
}
