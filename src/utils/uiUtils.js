import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export const buildTagSelect = (options, tagMode = false, disabled = false) => {
  return (
    <Select
      mode={tagMode ? 'tags' : 'multiple'}
      style={{ width: '100%' }}
      placeholder="选择标签"
      tokenSeparators={[',']}
      disable={disabled}
    >
      {options.map((v, i) => <Option key={i}>{v}</Option>)}
    </Select>
  );
};

export default {
  buildTagSelect,
};
