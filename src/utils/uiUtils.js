import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export const buildTagSelect = (options, tagMode = false, disabled = false) => {
  const children = [];
  for (let i = 0; i < options.length; i++) {
    children.push(<Option key={i.toString(options.length)}>{options[i]}</Option>);
  }
  return (
    <Select
      mode={tagMode ? 'tags' : 'multiple'}
      style={{ width: '100%' }}
      placeholder="选择标签"
      tokenSeparators={[',']}
      disable={disabled}
    >
      {children}
    </Select>
  );
};

export default {
  buildTagSelect,
};
