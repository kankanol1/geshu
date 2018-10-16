import React, { PureComponent } from 'react';
import { Button, Icon, Card, List, Modal } from 'antd';
import PropTypes from 'prop-types';
import StorageFilePicker from './StorageFilePicker';

export default class FilePickerModal extends PureComponent {
  static defaultProps = {
    visible: false,
    title: undefined,
    pickerHeight: 300,
    okText: '确定',
    cancelText: '取消',
    onOk: undefined,
    onCancel: undefined,
    hideCancel: false,
    enableUpload: false,
    enableMkdir: false,
    allowSelectFolder: false,
    smallSize: false,
  };

  state = {
    selected: undefined,
  };

  render() {
    const {
      visible,
      title,
      pickerHeight,
      okText,
      cancelText,
      onOk,
      onCancel,
      hideCancel,
      enableUpload,
      enableMkdir,
      smallSize,
      allowSelectFolder,
    } = this.props;
    const cancelBtn = (
      <Button key="back" onClick={() => onCancel()}>
        {cancelText}
      </Button>
    );
    const okBtn = (
      <Button key="submit" type="primary" onClick={() => onOk(this.state.selected)}>
        {okText}
      </Button>
    );
    return (
      <Modal
        visible={visible}
        title={title}
        destroyOnClose
        footer={hideCancel ? [okBtn] : [cancelBtn, okBtn]}
        maskClosable={false}
      >
        <StorageFilePicker
          height={pickerHeight}
          onChange={v => this.setState({ selected: v })}
          enableMkdir={enableMkdir}
          enableUpload={enableUpload}
          smallSize={smallSize}
          allowSelectFolder={allowSelectFolder}
        />
      </Modal>
    );
  }
}

FilePickerModal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  pickerHeight: PropTypes.number,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  hideCancel: PropTypes.bool,
  enableUpload: PropTypes.bool,
  enableMkdir: PropTypes.bool,
  smallSize: PropTypes.bool,
  allowSelectFolder: PropTypes.bool,
};
