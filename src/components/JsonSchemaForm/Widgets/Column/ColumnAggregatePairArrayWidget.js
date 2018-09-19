import React from 'react';
import { Select, Tag, Icon } from 'antd';
import ConfigurationTable from '../../UI/ConfigurationTable';
import { callFuncElseError } from '../../utils';

// render array. []
export default class ColumnAggregatePairArrayWidget extends React.Component {
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
    const { enum: enumList } = this.props.schema.properties.value.items.properties.aggregate;
    const schema = result;
    if (error) {
      return (
        <React.Fragment>
          <p style={{ color: 'red', display: 'inline-block', paddingRight: '20px' }}>{error.message}</p>
          <Tag onClick={() => this.forceUpdate()} > <Icon type="sync" /> 刷新 </Tag>
        </React.Fragment>
      );
    }
    const renderData = this.state.data;
    const { required } = this.props;
    const { description } = this.props.schema;
    return (
      <ConfigurationTable
        canAdd={schema && this.state.data.length < schema.length * enumList.length}
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
          name: 'column',
          title: '列',
          render: (v, item, onChange) => (
            <Select
              placeholder="请选择列"
              onChange={e => onChange(e)}
              value={v}
            >
              {schema.map(i =>
                (
                  <Select.Option
                    key={i}
                    value={i}
                    disabled={this.state.data.filter((s) => {
                      return s.aggregate === item.aggregate && s.column === i;
                    }).length > 0 || this.state.data.filter((s) => {
                      return s.column === i;
                    }).length === enumList.length}
                  >
                    {i}
                  </Select.Option>
                )
              )}
            </Select>
        ),
          span: 11,
        },
        {
          name: 'aggregate',
          title: '聚集函数',
          render: (v, item, onChange) => (
            <Select
              placeholder="请选择聚集函数"
              onChange={e => onChange(e)}
              value={v}
            >
              {enumList.map(i =>
                (
                  <Select.Option
                    key={i}
                    value={i}
                    disabled={this.state.data.filter((s) => {
                      return s.column === item.column && s.aggregate === i;
                    }).length > 0 || this.state.data.filter((s) => {
                      return s.aggregate === i;
                    }).length === schema.length}
                  >
                    {i}
                  </Select.Option>
                )
              )}
            </Select>
          ),
          span: 11,
        },
      ]}
      />
    );
  }
}
