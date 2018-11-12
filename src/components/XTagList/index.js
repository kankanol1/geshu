import React, { Component } from 'react';
import { Tag, Icon, Input } from 'antd';

import styles from './index.less';

export default class XTagList extends Component {
  state = {
    edit: false,
    inputValue: undefined,
  };

  handleInputConfirm = props => {
    const { onAdd } = this.props;
    if (onAdd) {
      onAdd(this.state.inputValue);
    }
    this.setState({ inputValue: undefined, ...props });
  };

  render() {
    const { tags, editable, className } = this.props;
    return (
      <div className={className}>
        {tags.map(i => (
          <Tag
            className={styles.tag}
            key={i.name}
            color={i.color}
            closable={editable && this.state.edit}
          >
            {i.name}
          </Tag>
        ))}
        {editable &&
          !this.state.edit && (
            <Icon
              className={styles.edit}
              type="edit"
              onClick={() => this.setState({ edit: true })}
            />
          )}
        {editable &&
          this.state.edit && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={this.state.inputValue}
              onChange={v => this.setState({ inputValue: v.target.value })}
              onBlur={() => this.handleInputConfirm({ edit: false })}
              onPressEnter={() => this.handleInputConfirm()}
            />
          )}
      </div>
    );
  }
}
