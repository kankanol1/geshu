import React from 'react';
import { Input, Select, InputNumber } from 'antd';
import ConfigurationTable from '@/components/JsonSchemaForm/UI/ConfigurationTable';

const { Option } = Select;

const METHODS_STRING = [{ name: '空字符串', value: 'EMPTY' }, { name: '指定值', value: 'OTHER' }];

const METHODS_NUMBER = [
  { name: '最大值', value: 'MAX' },
  { name: '最小值', value: 'MIN' },
  { name: '平均值', value: 'AVG' },
  { name: '指定值', value: 'OTHER' },
];

const METHODS_BOOLEAN = [{ name: '布尔值真', value: 'TRUE' }, { name: '布尔值假', value: 'FALSE' }];
export default class FillNullConfig extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value, schema } = props;
    this.state = { renderData: value || [] };
  }

  render() {
    const { schema } = this.props;
    const { renderData } = this.state;
    const selectedColumns = renderData.filter(i => i.field);
    return (
      <ConfigurationTable
        canAdd={renderData.length < schema.length}
        canDelete
        data={renderData}
        onChange={v => {
          this.setState(
            {
              renderData: v,
            },
            () => this.props.onChange(v)
          );
        }}
        columns={[
          {
            name: 'field',
            title: '列名',
            render: (v, item, onChange) => (
              <Select placeholder="请选择" onChange={nv => onChange(nv)}>
                {schema.map((s, i) => (
                  <Option key={i} value={s.name} disabled={selectedColumns.includes(v)}>
                    {s.name}({s.type})
                  </Option>
                ))}
              </Select>
            ),
            span: 8,
          },
          {
            name: 'function',
            title: '填充方式',
            render: (v, item, onChange) => {
              if (!item.field) {
                return <Input disabled placeholder="请先选择列" />;
              } else {
                let options;
                const typeStr = schema.filter(i => i.name === item.field)[0].type.toLowerCase();
                switch (typeStr) {
                  case 'string':
                    options = METHODS_STRING;
                    break;
                  case 'boolean':
                    options = METHODS_BOOLEAN;
                    break;
                  default:
                    options = METHODS_NUMBER;
                }
                return (
                  <Select placeholder="请选择" onChange={nv => onChange(nv)}>
                    {options.map((s, i) => (
                      <Option key={i} value={s.value}>
                        {s.name}
                      </Option>
                    ))}
                  </Select>
                );
              }
            },
            span: 6,
          },
          {
            name: 'userDefined',
            title: '指定值',
            render: (v, item, onChange) => {
              if (item.function === 'OTHER') {
                const typeStr = schema.filter(i => i.name === item.field)[0].type.toLowerCase();
                if (['integer', 'long', 'float', 'double'].includes(typeStr)) {
                  return (
                    <InputNumber
                      style={{ width: '100%' }}
                      defaultValue={v}
                      value={v}
                      onChange={e => onChange(e)}
                    />
                  );
                }
                return (
                  <Input defaultValue={v} value={v} onChange={e => onChange(e.target.value)} />
                );
              }
              return <Input disabled />;
            },
            span: 8,
          },
        ]}
      />
    );
  }
}
