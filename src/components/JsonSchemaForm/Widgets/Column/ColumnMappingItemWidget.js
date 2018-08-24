import React from 'react';
import { Input, Select, Row, Col, Icon, Tag } from 'antd';
import { callFuncElseError } from '../../utils';

export default class ColumnMappingItemWidget extends React.Component {
  constructor(props) {
    super(props);
    const { formData } = this.props;
    this.state = {
      data: formData,
    };
  }
  componentWillReceiveProps(props) {
    const { formData } = props;
    this.setState({
      data: formData,
    });
  }

  onChange(name, value) {
    this.setState({ data: { ...this.state.data, [name]: value } },
      () => this.props.onChange(this.state.data));
  }

  render() {
    const { required } = this.props;
    const { data } = this.state;
    const { getField } = this.props.uiSchema['ui:options'];
    const { result, error } = callFuncElseError(getField);
    const schema = result;
    return (
      <React.Fragment>
        <Row>
          <Col span={8}><legend> 输入列 {required ? '*' : null} </legend></Col>
          <Col span={16}>
            {
            error ?
              <p style={{ color: 'red' }}>{error.message} <Tag onClick={() => this.forceUpdate()} > <Icon type="sync" /> 刷新 </Tag></p>
            :
              (
                <Select
                  placeholder="请选择"
                  onChange={e => this.onChange('column', e)}
                  value={data && data.column}
                >
                  {schema.map(i =>
                    (
                      <Select.Option
                        key={i}
                        value={i}
                      >
                        {i}
                      </Select.Option>
                    )
                  )}
                </Select>
              )
          }
          </Col>
        </Row>
        <Row>
          <Col span={8}><legend> 输出列 {required ? '*' : null} </legend></Col>
          <Col span={16}>
            <Input
              defaultValue={data.name}
              value={data.name}
              onChange={e => this.onChange('name', e.target.value)}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
