import React from 'react';
import { Select } from 'antd';

export default class SelectColumnWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      data: value,
    };
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    this.setState({
      data: value,
    });
  }

  render() {
    const { data } = this.state;
    const { schema } = this.props;
    return (
      <Select
        placeholder="请选择"
        onChange={v => {
          this.setState({ data: v });
          this.props.onChange(v);
        }}
        value={data}
      >
        {schema.map(i => (
          <Select.Option key={i.name} value={i.name}>
            {`${i.name} (${i.type})`}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
