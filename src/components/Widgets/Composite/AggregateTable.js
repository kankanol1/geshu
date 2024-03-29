import React from 'react';
import { Input, Checkbox, Select } from 'antd';
import ConfigurationTable from '@/components/XWidgets/UI/ConfigurationTable';
import MultiColumnSelector from '../Column/MultiColumnSelector';

const { Option } = Select;

const AGGS = [
  { name: '最大值', value: 'MAX' },
  { name: '最小值', value: 'MIN' },
  { name: '平均值', value: 'AVG' },
  { name: '求和', value: 'SUM' },
  { name: '计数', value: 'COUNT' },
];

const computeAs = item => {
  if (item.fields.includes('*')) {
    return `${item.aggregateFunction}${item.distinct ? '_distinct' : ''}_star_`;
  } else {
    return `${item.aggregateFunction}${item.distinct ? '_distinct' : ''}_${item.fields.join('_')}`;
  }
};

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
          {s.name}
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
    const { schema, cellWrapper } = this.props;
    const { renderData } = this.state;
    // translate data to checkbox.
    return (
      <ConfigurationTable
        canAdd
        canDelete
        cellWrapper={cellWrapper}
        orderSpan={1}
        onChange={v => {
          // check stauts.
          const nv = v
            .map(
              i =>
                i.fields && i.fields.includes('*')
                  ? { ...i, distinct: false }
                  : { ...i, distinct: i.distinct || false }
            )
            .map(i => {
              // handle special cases.
              if (i.aggregateFunction !== 'COUNT' && i.fields && i.fields.includes('*')) {
                // reset
                return { ...i, fields: undefined };
              } else return i;
            });
          this.setState(
            {
              renderData: nv,
            },
            () => this.props.onChange(nv)
          );
        }}
        data={renderData}
        columns={[
          {
            name: 'aggregateFunction',
            title: '聚集函数',
            render: (v, item, onChange) => (
              <Select
                placeholder="请选择"
                onChange={nv =>
                  onChange(
                    nv,
                    nv && item.fields && { as: computeAs({ ...item, aggregateFunction: nv }) }
                  )
                }
                value={v}
              >
                {AGGS.map((s, i) => (
                  <Option key={i} value={s.value}>
                    {s.name}
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
              if (!item.aggregateFunction) {
                return <Input value="请先选择聚集函数" disabled />;
              } else if (item.aggregateFunction === 'COUNT') {
                return (
                  <MultiColumnSelector
                    value={v}
                    schema={schema}
                    enableStar
                    multiple
                    onChange={nv =>
                      onChange(
                        nv,
                        nv && item.aggregateFunction && { as: computeAs({ ...item, fields: nv }) }
                      )
                    }
                  />
                );
              } else {
                return (
                  <SingleColumnSelectAsArray
                    value={v}
                    schema={schema}
                    onChange={nv =>
                      onChange(
                        nv,
                        nv && item.aggregateFunction && { as: computeAs({ ...item, fields: nv }) }
                      )
                    }
                  />
                );
              }
            },
            span: 11,
          },
          {
            name: 'distinct',
            title: '去重',
            type: 'checkbox',
            render: (v, item, onChange) => (
              <div style={{ textAlign: 'center' }}>
                {item.fields && item.fields.includes('*') ? (
                  <Checkbox checked={false} disabled />
                ) : (
                  <Checkbox
                    checked={v}
                    onChange={e =>
                      onChange(
                        e.target.checked,
                        item.aggregateFunction &&
                          item.fields && { as: computeAs({ ...item, distinct: e.target.checked }) }
                      )
                    }
                  />
                )}
              </div>
            ),
            span: 2,
          },
          {
            name: 'as',
            title: '新列名',
            render: (v, item, onChange) => {
              return <Input defaultValue={v} value={v} onChange={e => onChange(e.target.value)} />;
            },
            span: 4,
          },
        ]}
      />
    );
  }
}
