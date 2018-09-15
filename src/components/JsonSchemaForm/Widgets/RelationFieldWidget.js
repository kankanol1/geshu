import React from 'react';
import { Row, Col, Input, InputNumber } from 'antd';


class RelationFieldWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: props.value,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      currentValue: props.value,
    });
  }

  render() {
    const {
      schema,
      type,
      onChange,
    } = this.props;
    const { description } = schema;
    const { currentValue } = this.state;
    if (type === 'integer') {
      const newCurrentValue = parseInt(currentValue, 10);
      return (
        <InputNumber
          style={{ width: '100%' }}
          value={newCurrentValue}
          onChange={(newValue) => {
            onChange(`${newValue}`);
          }}
        />
      );
    }
    return (
      <Input
        value={currentValue}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    );
  }
}


export default RelationFieldWidget;
