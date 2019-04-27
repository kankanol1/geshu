import React from 'react';
import { Select, Dropdown, Input, Menu } from 'antd';

const { Option } = Select;

export default class XInputSelect extends React.PureComponent {
  componentWillMount() {
    this.setState({
      value: undefined,
      options: this.props.options || [],
      selected: '-',
    });
  }

  handleValueChange(v, i) {
    const { onChange } = this.props;
    this.setState({ value: v, selected: i });
    if (onChange) onChange(v);
  }

  render() {
    const { placeholder, onChange } = this.props;
    const { value, options, visible, selected } = this.state;
    const menu = (
      <Menu selectedKeys={[selected]} style={{ maxHeight: '400px', overflow: 'auto' }}>
        {value &&
          options.filter(i => i === value).length === 0 && <Menu.Item key="-">{value}</Menu.Item>}
        {options.map((i, j) => (
          <Menu.Item key={j}>
            <div onMouseDown={e => this.handleValueChange(i, `${j}`)}>{i}</div>
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown visible={visible && options.length > 0} overlay={menu}>
        <Input
          placeholder={placeholder}
          value={value}
          onFocus={() => this.setState({ visible: true })}
          onBlur={() => setTimeout(this.setState({ visible: false }), 500)}
          onChange={v => this.handleValueChange(v.target.value, '-')}
        />
      </Dropdown>
    );
  }
}
