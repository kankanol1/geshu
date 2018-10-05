import React from 'react';
import { Select, Tag, Icon } from 'antd';
import ConfigurationTable from '../../UI/ConfigurationTable';
import { callFuncElseError } from '../../utils';

export default class ColumnScalingStrategyTable extends React.Component {
  constructor(props) {
    super(props);
    const { formData } = this.props;
    this.state = {
      data: (formData || []),
    };
    if (!formData) {
      this.props.onChange([]);
    }
  }

  componentWillReceiveProps(props) {
    const { formData } = props;
    this.setState({
      data: (formData || []),
    });
    if (!formData) {
      this.props.onChange([]);
    }
  }

  render() {
    const { getField } = this.props.uiSchema['ui:options'];
    const { result, error } = callFuncElseError(getField);
    const schema = result;
    if (error) {
      return (
        <React.Fragment>
          <p style={{ color: 'red', display: 'inline-block', paddingRight: '20px' }}>{error.message}</p>
        </React.Fragment>
      );
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
          () => this.props.onChange(v)
          );
        }
          }
        data={renderData}
        columns={[{
          name: 'column',
          title: description + (required ? '*' : ''),
          render: (v, item, onChange) => (
            <Select
              placeholder="请选择"
              onChange={e => onChange(e)}
              value={v}
            >
              {schema.map(i => (
                <Select.Option
                  key={i.name}
                  value={i.name}
                  disabled={this.state.data.filter(s => s.column === i.name).length > 0}
                >
                  {`${i.name} (${i.type})`}
                </Select.Option>
              )
              )}
            </Select>
          ),
          span: 14,
        }, {
          name: 'strategy',
          title: this.props.schema.items.properties.strategy.description + (required ? '*' : ''),
          render: (v, item, onChange) => (
            <Select
              placeholder="请选择"
              onChange={e => onChange(e)}
              value={v}
            >
              {this.props.schema.items.properties.strategy.enum.map(i => (
                <Select.Option
                  key={i}
                  value={i}
                >
                  {i}
                </Select.Option>
              )
              )}
            </Select>
          ),
          span: 8,
        },
        ]}
      />
    );
  }
}
