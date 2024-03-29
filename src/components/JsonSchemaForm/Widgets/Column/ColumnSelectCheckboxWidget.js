import React from 'react';
import { Input, Checkbox, Tag, Icon } from 'antd';
import ConfigurationTable from '../../UI/ConfigurationTable';
import { callFuncElseError } from '../../utils';

// render object. {value: []}
export default class ColumnSelectCheckboxWidget extends React.Component {
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
      return (
        <React.Fragment>
          <p style={{ color: 'red', display: 'inline-block', paddingRight: '20px' }}>
            {error.message}
          </p>
        </React.Fragment>
      );
    }
    const { data } = this.state;
    // translate data to checkbox.
    const renderData = schema.map(i => ({
      name: i.name,
      disName: `${i.name}(${i.type})`,
      checked: data ? data.includes(i.name) : false,
    }));
    return (
      <ConfigurationTable
        orderSpan={2}
        onChange={v => {
          const newSelected = v.filter(i => i.checked).map(i => i.name);
          this.setState(
            {
              data: newSelected,
            },
            () => this.props.onChange({ value: newSelected })
          );
        }}
        data={renderData}
        columns={[
          {
            name: 'disName',
            title: '列名',
            render: (v, item, onChange) => <Input defaultValue={v} value={v} disabled />,
            span: 18,
          },
          {
            name: 'checked',
            title: '是否选择',
            type: 'checkbox',
            render: (v, item, onChange) => (
              <div style={{ textAlign: 'center' }}>
                <Checkbox checked={v} onChange={e => onChange(e.target.checked)} />
              </div>
            ),
            span: 4,
          },
        ]}
      />
    );
  }
}
