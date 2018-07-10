import React from 'react';
import { Input, Select } from 'antd';
import ConfigurationTable from '../../UI/ConfigurationTable';
import { callFuncElseError } from '../../utils';

export default class ColumnMappingWidget extends React.Component {
  constructor(props) {
    super(props);
    const { formData } = this.props;
    this.state = {
      data: formData.value || [],
    };
  }
  componentWillReceiveProps(props) {
    const { formData } = props;
    this.setState({
      data: formData.value || [],
    });
  }

  render() {
    const { inputColumnTitle, outputColumnTitle, getField } = this.props.uiSchema['ui:options'];
    const { result, error } = callFuncElseError(getField);
    const schema = result;
    if (error) {
      return <p style={{ color: 'red' }}>{error.message}</p>;
    }
    return (
      <ConfigurationTable
        canAdd={schema && this.state.data.length < schema.length}
        canDelete
        onChange={v =>
            this.setState({
              data: v,
            },
            () => this.props.onChange({ value: v })
          )
          }
        data={this.state.data}
        columns={[{
          name: 'input',
          title: inputColumnTitle || '输入列',
          render: (v, item, onChange) => (
            <Select
              placeholder="请选择"
              onChange={e => onChange(e)}
              value={v}
            >
              {schema.map(i =>
                (
                  <Select.Option
                    key={i}
                    value={i}
                    disabled={this.state.data.filter(s => s.input === i).length > 0}
                  >
                    {i}
                  </Select.Option>
                )
              )}
            </Select>
        ),
          span: 11,
        }, {
          name: 'output',
          title: outputColumnTitle || '输出列',
          render: (v, item, onChange) => (
            <Input
              defaultValue={v}
              value={v}
              onChange={e => onChange(e.target.value)}
            />
        ),
          span: 11,
        },
      ]}
      />
    );
  }
}
