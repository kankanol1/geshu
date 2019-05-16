import React from 'react';
import { Row, Col, Input, Icon } from 'antd';

export class RenameList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ value: props.value });
  }

  handleChange = (v, i) => {
    const { value } = this.state;
    value[i].name = v.target.value;
    this.props.onChange(value);
  };

  render() {
    const { value } = this.state;
    return (
      <React.Fragment>
        {value.map((i, ind) => (
          <Row key={ind} span={24}>
            <Col span={11}>
              <Input disabled value={i.origin} />
            </Col>
            <Col span={1}>
              {' '}
              <Icon type="arrow-right" />{' '}
            </Col>
            <Col span={11}>
              <Input value={i.name} onChange={v => this.handleChange(v, ind)} />{' '}
            </Col>
          </Row>
        ))}
      </React.Fragment>
    );
  }
}
