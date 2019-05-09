import React from 'react';
import { Input, Checkbox, Select } from 'antd';
import ConfigurationTable from '@/components/JsonSchemaForm/UI/ConfigurationTable';
import MultiColumnSelector from '../Column/MultiColumnSelector';

const { Option } = Select;

const AGGS = [
  { name: '最大值', value: 'MAX' },
  { name: '最小值', value: 'MIN' },
  { name: '平均值', value: 'AVG' },
  { name: '求和', value: 'SUM' },
  { name: '计数', value: 'COUNT' },
];

const SingleColumnSelectAsArray = props => {
  const { placeholder, schema, onChange, value } = props;
  let defaultValue;
  if (value && value.length >= 1) {
    [defaultValue] = value;
  }
  return (
    <Select
      placeholder={placeholder}
      onChange={v => {
        if (onChange) onChange([v]);
      }}
      defaultValue={defaultValue}
    >
      {schema.map((s, i) => (
        <Option key={i} value={s.name}>
          {' '}
          {s.name}{' '}
        </Option>
      ))}
    </Select>
  );
};

export default class AggregateTable extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value, schema } = props;
    // value: {fields:[], as:, aggregate:, distinct}
    this.state = { renderData: value || [] };
  }

  render() {
    const { schema } = this.props;
    const { renderData } = this.state;
    // translate data to checkbox.
    return (
      <ConfigurationTable
        canAdd
        canDelete
        orderSpan={1}
        onChange={v => {
          this.setState(
            {
              renderData: v,
            },
            () => this.props.onChange(v)
          );
        }}
        data={renderData}
        columns={[
          {
            name: 'aggregate',
            title: '聚集函数',
            render: (v, item, onChange) => (
              <Select placeholder="请选择" onChange={nv => onChange(nv)}>
                {AGGS.map((s, i) => (
                  <Option key={i} value={s.value}>
                    {' '}
                    {s.name}{' '}
                  </Option>
                ))}
              </Select>
            ),
            span: 4,
          },
          {
            name: 'fields',
            title: '字段',
            render: (v, item, onChange) => {
              if (!item.aggregate) {
                return <Input value="请先选择聚集函数" disabled />;
              } else if (item.aggregate === 'COUNT') {
                return <MultiColumnSelector schema={schema} multiple onChange={onChange} />;
              } else {
                return <SingleColumnSelectAsArray schema={schema} onChange={onChange} />;
              }
            },
            span: 11,
          },
          {
            name: 'distinct',
            title: '是否去重',
            type: 'checkbox',
            render: (v, item, onChange) => (
              <div style={{ textAlign: 'center' }}>
                <Checkbox checked={v} onChange={e => onChange(e.target.checked)} />
              </div>
            ),
            span: 2,
          },
          {
            name: 'as',
            title: '新列名',
            render: (v, item, onChange) => {
              let value = v;
              if (!value && item.aggregate && item.fields) {
                value = `${item.aggregate}${item.distinct ? '_distinct' : ''}_${item.fields.join(
                  '_'
                )}`;
              }
              return <Input defaultValue={v} value={value} onChange={onChange} />;
            },
            span: 4,
          },
        ]}
      />
    );
  }
}
