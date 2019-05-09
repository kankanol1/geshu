import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

class MultiColumnSelector extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      currentValue: value,
    };
  }

  handleChange(v) {
    const { onChange } = this.props;
    this.setState({ currentValue: v }, () => {
      if (onChange) onChange(v);
    });
  }

  render() {
    const { multiple, placeholder, enableStar, schema, value } = this.props;
    const { currentValue } = this.state;
    return (
      <Select
        mode={multiple && 'multiple'}
        placeholder={placeholder}
        onChange={v => {
          if (v.includes('*')) {
            this.handleChange(['*']);
          } else {
            this.handleChange(v);
          }
        }}
        defaultValue={value}
        value={currentValue}
      >
        {enableStar && <Option value="*">*</Option>}
        {schema.map((s, i) => (
          <Option key={i} value={s.name}>
            {s.name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default MultiColumnSelector;
