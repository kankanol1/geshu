import React from 'react';
import { Input, Select } from 'antd';
import ConfigurationTable from '../../UI/ConfigurationTable';
import SelectWidget from '../SelectWidget';

export default class ColumnRenameWidget extends React.Component {
  constructor(props) {
    super(props);
    const { formData } = this.props;
    this.state = {
      data: [],
    };
  }
  componentWillReceiveProps(props) {
    const { formData } = props;
    this.setState({
      data: [],
    });
  }

  render() {
    const { getField } = this.props.uiSchema['ui:options'];
    let schema;
    let error;
    if (getField !== undefined) {
      try {
        schema = getField();
      } catch (err) {
        error = err;
      }
    } else {
      error = '未定义处理函数,请通过ui:option设置';
    }
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
            // () => this.props.onChange(v)
          )
          }
        data={this.state.data}
        columns={[{
          name: 'input',
          title: '原列名',
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
          title: '新列名',
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
