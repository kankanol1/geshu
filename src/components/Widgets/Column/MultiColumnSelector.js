import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const MultiColumnSelector = props => {
  const { multiple, placeholder, schema, onChange, value } = props;
  return (
    <Select
      mode={multiple && 'multiple'}
      placeholder={placeholder}
      onChange={v => {
        if (onChange) onChange(v);
      }}
      defaultValue={value}
    >
      {schema.map((s, i) => (
        <Option key={i} value={s.name}>
          {s.name}
        </Option>
      ))}
    </Select>
  );
};

export default MultiColumnSelector;
