import React from 'react';
import { Select } from 'antd';
import ConfigurationTable from '../../UI/ConfigurationTable';
import { callFuncElseError } from '../../utils';

export default class ColumnSelectSelectorWidget extends React.Component {
  constructor(props) {
    super(props);
    const { formData } = this.props;
    this.state = {
      data: formData.value || [],
    };
    if (!formData.value) {
      this.props.onChange({ value: [] });
    }
  }

  componentWillReceiveProps(props) {
    const { formData } = props;
    this.setState({
      data: formData.value || [],
    });
    if (!formData.value) {
      this.props.onChange({ value: [] });
    }
  }

  render() {
    const { getField } = this.props.uiSchema['ui:options'];
    const { result, error } = callFuncElseError(getField);
    const schema = result;
    if (error) {
      return <p style={{ color: 'red' }}>{error.message}</p>;
    }
    const renderData = this.state.data;
    const { required } = this.props;
    const { description } = this.props.schema;
    return (
      <ConfigurationTable
        canAdd={schema && this.state.data.length < schema.length}
        canDelete
        onChange={(v) => {
              this.setState({
                data: v,
              },
              () => this.props.onChange({ value: v })
              );
            }
          }
        data={renderData}
        columns={[{
          name: 'name',
          title: description + (required ? '*' : ''),
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
          span: 22,
        },
      ]}
      />
    );
  }
}
