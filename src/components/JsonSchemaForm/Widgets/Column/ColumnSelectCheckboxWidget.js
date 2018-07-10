import React from 'react';
import { Input, Checkbox } from 'antd';
import ConfigurationTable from '../../UI/ConfigurationTable';
import { callFuncElseError } from '../../utils';

export default class ColumnSelectWidget extends React.Component {
  constructor(props) {
    super(props);
    const { formData } = this.props;
    this.state = {
      data: formData.value,
    };
    if (!formData.value) {
      this.props.onChange({ value: [] });
    }
  }

  componentWillReceiveProps(props) {
    const { formData } = props;
    this.setState({
      data: formData.value,
    });
    if (!formData.value) {
      this.props.onChange({ value: [] });
    }
  }

  render() {
    const { getField } = this.props.uiSchema['ui:options'];
    const { result, error } = callFuncElseError(getField);
    const schema = result;
    if (error) {
      return <p style={{ color: 'red' }}>{error.message}</p>;
    }
    const { data } = this.state;
    // translate data to checkbox.
    const renderData = schema.map(i => ({ name: i, checked: data ? data.includes(i) : false }));
    return (
      <ConfigurationTable
        onChange={(v) => {
              const newSelected = v.filter(i => i.checked).map(i => i.name);
              this.setState({
                data: newSelected,
              },
              () => this.props.onChange({ value: newSelected })
              );
            }
          }
        data={renderData}
        columns={[{
          name: 'name',
          title: '列名',
          render: (v, item, onChange) => (
            <Input defaultValue={v} value={v} disabled />
        ),
          span: 18,
        }, {
          name: 'checked',
          title: '是否选择',
          render: (v, item, onChange) => (
            <div style={{ textAlign: 'center' }}>
              <Checkbox
                checked={v}
                onChange={e => onChange(e.target.checked)}
              />
            </div>
        ),
          span: 4,
        },
      ]}
      />
    );
  }
}
