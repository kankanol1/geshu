import React from 'react';
import { Input, Select } from 'antd';
import ConfigurationTable from '@/components/JsonSchemaForm/UI/ConfigurationTable';

const { Option } = Select;

const METHODS = [
  { name: '最大值', value: 'MAX' },
  { name: '最小值', value: 'MIN' },
  { name: '中位数', value: 'MEDIUM' },
  { name: '平均值', value: 'AVG' },
  { name: '总值', value: 'SUM' },
  { name: '出现最多值', value: 'MOST' },
  { name: '出现最少值', value: 'LEAST' },
  { name: '指定值', value: 'SPEC' },
];

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
                  <Option key={i} value={s.value} disabled={selectedColumns.includes(v)}>
                    {s.name}
                  </Option>
                ))}
              </Select>
            ),
            span: 8,
          },
          {
            name: 'method',
            title: '填充方式',
            render: (v, item, onChange) => (
              <Select placeholder="请选择" onChange={nv => onChange(nv)}>
                {METHODS.map((s, i) => (
                  <Option key={i} value={s.value}>
                    {s.name}
                  </Option>
                ))}
              </Select>
            ),
            span: 6,
          },
          {
            name: 'value',
            title: '指定值',
            render: (v, item, onChange) => {
              if (item.method === 'SPEC') {
                return <Input defaultValue={v} value={v} onChange={onChange} />;
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
