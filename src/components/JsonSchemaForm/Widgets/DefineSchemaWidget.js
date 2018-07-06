
import React from 'react';
import { Input, Checkbox, Select } from 'antd';
import ConfigurationTable from '../UI/ConfigurationTable';

const { Option } = Select;

const schemaTypes = [
  { name: 'String', value: '"string"' },
  { name: 'Double', value: '"double"' },
  { name: 'Integer', value: '"integer"' },
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
    const { mode } = this.props.mode || 'normal';
    const showExtraOp = (mode === 'normal');
    return (
      <ConfigurationTable
        canAdd={showExtraOp}
        canDelete={showExtraOp}
        data={this.state.data}
        maxHeight={this.props.height}
        opSpan={2}
        onChange={v =>
            this.setState({
              data: Object.assign([], v),
            }, () => this.props.onChange(v))
          }
        columns={[{
          name: 'nullable',
          title: '可为null',
          span: 6,
          render: (v, item, onChange) => (
            <div style={{ textAlign: 'center' }}>
              <Checkbox onChange={e => onChange(e.target.checked)} checked={v} />
            </div>
          ),
        }, {
          name: 'name',
          title: '列名',
          span: 8,
          render: (v, item, onChange) => (
            <Input defaultValue={v} value={v} onChange={e => onChange(e.target.value)} />
          ),
        }, {
          name: 'type',
          title: '类型',
          span: 8,
          render: (v, item, onChange) => (
            <Select style={{ width: 120 }} onChange={e => onChange(e)} defaultValue={v} value={v} >
              {schemaTypes.map(
              type => <Option value={type.value} key={type.name}>{type.name}</Option>
            )}
            </Select>
          ),
        }]}
      />
    );
  }
}
