import React from 'react';
import { Select, Tag, Icon, Input } from 'antd';
import XInputSelect from '@/components/XInputSelect';
import ConfigurationTable from '@/components/XWidgets/UI/ConfigurationTable';

const operatorList = [
  { name: '=', value: 'EQ' },
  { name: '!=', value: 'NE' },
  { name: '>', value: 'GT' },
  { name: '>=', value: 'GE' },
  { name: '<', value: 'LT' },
  { name: '<=', value: 'LE' },
  { name: 'LIKE', value: 'LIKE' },
];

class ExpressionWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      data: value,
    };
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    this.setState({
      data: value,
    });
  }

  render() {
    const { data } = this.state;
    const { options, loptions, roptions, cellWrapper } = this.props;
    const leftOptions = loptions || options;
    const rightOptions = roptions || options;
    return (
      <ConfigurationTable
        canAdd
        canDelete
        onChange={v => {
          this.setState({ data: v });
          this.props.onChange(v);
        }}
        data={data}
        cellWrapper={cellWrapper}
        columns={[
          {
            name: 'leftExpression',
            title: '左表达式',
            render: (v, item, onChange) => (
              <XInputSelect
                options={leftOptions}
                defaultValue={v}
                value={v}
                onChange={e => onChange(e)}
              />
            ),
            span: 9,
          },
          {
            name: 'comparisonSymbol',
            title: '运算符',
            render: (v, item, onChange) => (
              <Select placeholder="请选择" onChange={e => onChange(e)} value={v}>
                {operatorList.map(i => (
                  <Select.Option key={i.value} value={i.value}>
                    {i.name}
                  </Select.Option>
                ))}
              </Select>
            ),
            span: 4,
          },
          {
            name: 'rightExpression',
            title: '右表达式',
            render: (v, item, onChange) => (
              <XInputSelect
                options={rightOptions}
                defaultValue={v}
                value={v}
                onChange={e => onChange(e)}
              />
            ),
            span: 9,
          },
        ]}
      />
    );
  }
}

export default ExpressionWidget;
