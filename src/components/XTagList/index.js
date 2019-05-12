import React, { Component } from 'react';
import { Tag, Icon, Input, Button, Tooltip } from 'antd';

import styles from './index.less';

export default class XTagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      inputValue: undefined,
      tags: [...props.tags],
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ tags: [...props.tags] });
  }

  handleInputConfirm = (props, callback) => {
    const { onAdd, distinct } = this.props;
    const newTags = this.state.tags;
    if (this.state.inputValue && onAdd) {
      const newItem = onAdd(this.state.inputValue);
      if (!distinct || !this.props.tags.map(i => i.name).includes(newItem.name)) {
        newTags.push(newItem);
      }
    }
    this.setState({ inputValue: undefined, tags: newTags, ...props }, callback && callback());
  };

  render() {
    const { editable, className, tooltip } = this.props;
    const { tags } = this.state;
    return (
      <div className={className}>
        {tags.map((i, k) => (
          <Tag
            className={styles.tag}
            key={k}
            color={i.color}
            closable={editable && this.state.edit}
            afterClose={() => this.setState({ tags: tags.filter(tag => tag.name !== i.name) })}
          >
            {i.name}
          </Tag>
        ))}
        {editable &&
          !this.state.edit && (
            <Tooltip title={tooltip}>
              <Icon
                className={styles.edit}
                type="edit"
                onClick={() => this.setState({ edit: true })}
              />
            </Tooltip>
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
              // onBlur={() => this.handleInputConfirm({ edit: false })}
              onPressEnter={() => this.handleInputConfirm()}
            />
          )}
        {editable &&
          this.state.edit && (
            <Button
              type="primary"
              style={{ marginLeft: '4px' }}
              size="small"
              onClick={() => {
                this.handleInputConfirm({ edit: false }, () => {
                  if (this.props.onChanged) this.props.onChanged(this.state.tags);
                });
              }}
            >
              保存
            </Button>
          )}
        {editable &&
          this.state.edit && (
            <Button
              type="dashed"
              style={{ marginLeft: '4px' }}
              size="small"
              onClick={() => {
                this.setState({ tags: this.props.tags, edit: false });
              }}
            >
              取消
            </Button>
          )}
      </div>
    );
  }
}
