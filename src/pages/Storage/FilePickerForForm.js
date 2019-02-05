import React from 'react';
import { Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import StorageFilePicker from './StorageFilePicker';

export default class FilePickerForForm extends React.PureComponent {
  static defaultProps = {
    type: 'default',
    folderOnly: false,
    allowSelectFolder: true,
    value: undefined,
    enableMkdir: false,
    enableUpload: false,
    mode: 'all',
    folderType: undefined,
    view: undefined,
    project: undefined,
    descriptionHidePrefix: true,
  };

  state = {
    selected: undefined,
    visible: false,
    candidate: undefined,
  };

  onChange = v => {
    this.setState({ selected: v });
    const { onChange } = this.props;
    if (onChange) onChange(v);
  };

  generateDescription = selected => {
    if (this.props.descriptionHidePrefix) {
      return selected.path;
    }
    if (selected.type !== 'project') {
      return `[${selected.type === 'private' ? '个人文件' : '公开文件'}] ${selected.path}`;
    } else {
      return `[项目文件](${selected.projectName}) ${selected.path}`;
    }
  };

  renderDefault() {
    return (
      <StorageFilePicker
        smallSize
        height={280}
        onChange={this.onChange}
        folderOnly={this.props.folderOnly}
        allowSelectFolder={this.props.allowSelectFolder}
        enableUpload={this.props.enableUpload}
        enableMkdir={this.props.enableMkdir}
        mode={this.props.mode}
        type={this.props.folderType}
        view={this.props.view}
        project={this.props.project}
      />
    );
  }

  renderInline() {
    return (
      <React.Fragment>
        <Button
          onClick={() => {
            this.setState({ visible: !this.state.visible });
          }}
        >
          选择
        </Button>
        <Modal
          visible={this.state.visible}
          title="选择文件"
          onOk={() => {
            this.onChange(this.state.candidate);
            this.setState({ visible: false });
          }}
          onCancel={() => this.setState({ candidate: undefined, visible: false })}
        >
          <StorageFilePicker
            smallSize
            height={280}
            folderOnly={this.props.folderOnly}
            onChange={v => this.setState({ candidate: v })}
            allowSelectFolder={this.props.allowSelectFolder}
            enableUpload={this.props.enableUpload}
            enableMkdir={this.props.enableMkdir}
            mode={this.props.mode}
            type={this.props.folderType}
            view={this.props.view}
            project={this.props.project}
          />
        </Modal>
      </React.Fragment>
    );
  }

  render() {
    const { type, value } = this.props;
    const { selected } = this.state;
    const renderValue = selected || value;
    return (
      <div>
        <span
          style={{
            paddingLeft: '20px',
            paddingRight: '20px',
            lineHeight: '16px',
            display: 'inline-block',
          }}
        >
          {renderValue ? `已选择:${this.generateDescription(renderValue)}` : '请选择'}
        </span>
        {type === 'inline' ? this.renderInline() : this.renderDefault()}
      </div>
    );
  }
}

FilePickerForForm.propTypes = {
  type: PropTypes.string,
  folderOnly: PropTypes.bool,
  allowSelectFolder: PropTypes.bool,
  value: PropTypes.object,
  enableMkdir: PropTypes.bool,
  enableUpload: PropTypes.bool,
  mode: PropTypes.string,
  folderType: PropTypes.string,
  view: PropTypes.string,
  project: PropTypes.object,
  descriptionHidePrefix: PropTypes.bool,
};
