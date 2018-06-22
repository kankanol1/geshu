import React from 'react';
import StorageFilePicker from './StorageFilePicker';

export default class FilePickerForForm extends React.PureComponent {
  state={
    selected: undefined,
  }

  onChange = (v) => {
    this.setState({ selected: v });
    const { onChange } = this.props;
    if (onChange) onChange(v);
  }

  generateDescription = (selected) => {
    if (selected.type !== 'project') {
      return `[${selected.type === 'private' ? '个人文件' : '公开文件'}] ${selected.path}`;
    } else {
      return `[项目文件](${selected.projectName}) ${selected.path}`;
    }
  }
  render() {
    const { selected } = this.state;
    return (
      <div>
        <span style={{ lineHeight: '16px', display: 'inline-block' }}>{selected ?
          `已选择:${this.generateDescription(selected)}`
          : '请选择'}
        </span>
        <StorageFilePicker
          smallSize
          allowSelectFolder
          height={280}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
