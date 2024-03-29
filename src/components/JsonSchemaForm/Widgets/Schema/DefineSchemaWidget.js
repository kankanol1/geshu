import React from 'react';
import { Input, Checkbox, Select } from 'antd';
import ConfigurationTable from '../../UI/ConfigurationTable';

const { Option } = Select;

const schemaTypes = [
  { name: '字符串(STRING)', value: 'STRING' },
  { name: '浮点型(DOUBLE)', value: 'DOUBLE' },
  { name: '整型(INT)', value: 'INT' },
  { name: '布尔值(BOOLEAN)', value: 'BOOLEAN' },
  { name: '长整型(LONG)', value: 'LONG' },
  { name: '时间戳(TIMESTAMP)', value: 'TIMESTAMP' },
];

export default class DefineSchemaWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    const { formData } = this.props;
    this.state = {
      data: formData === undefined ? [] : formData,
    };
  }

  componentWillReceiveProps(props) {
    const { formData } = props;
    this.setState({
      data: formData === undefined ? [] : formData,
    });
  }

  render() {
    // mode: normal (can add, delete, modify), modify (can only modify)
    const mode = this.props.mode || 'normal';
    const showExtraOp = mode === 'normal';
    return (
      <ConfigurationTable
        canAdd={showExtraOp}
        canDelete={showExtraOp}
        data={this.state.data}
        maxHeight={this.props.height}
        opSpan={showExtraOp ? 2 : 0}
        onChange={v =>
          this.setState(
            {
              data: Object.assign([], v),
            },
            () => this.props.onChange(v)
          )
        }
        columns={[
          {
            name: 'nullable',
            title: '可为null',
            span: showExtraOp ? 4 : 6,
            render: (v, item, onChange) => (
              <div style={{ textAlign: 'center' }}>
                <Checkbox onChange={e => onChange(e.target.checked)} checked={v} />
              </div>
            ),
          },
          {
            name: 'name',
            title: '列名',
            span: 10,
            render: (v, item, onChange) => (
              <Input defaultValue={v} value={v} onChange={e => onChange(e.target.value)} />
            ),
          },
          {
            name: 'type',
            title: '类型',
            span: 8,
            render: (v, item, onChange) => (
              <Select
                style={{ width: '100%' }}
                onChange={e => onChange(e)}
                defaultValue={v}
                value={v}
              >
                {schemaTypes.map(type => (
                  <Option value={type.value} key={type.name}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            ),
          },
        ]}
      />
    );
  }
}
