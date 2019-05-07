import React from 'react';
import { Input, Checkbox, Tag, Icon } from 'antd';
import ConfigurationTable from '@/components/JsonSchemaForm/UI/ConfigurationTable';

// render object. {value: []}
export default class ColumnSelectCheckboxWidget extends React.Component {
  constructor(props) {
    super(props);
    const { formData, schema } = props;
    this.state = {
      renderData: schema.map(i => ({
        name: i.name,
        disName: `${i.name}(${i.type})`,
        checked: formData ? formData.includes(i.name) : false,
      })),
    };
  }

  componentWillReceiveProps(props) {
    const { formData, schema } = props;
    if (schema !== this.props.schema) {
      this.setState({
        renderData: schema.map(i => ({
          name: i.name,
          disName: `${i.name}(${i.type})`,
          checked: formData ? formData.includes(i.name) : false,
        })),
      });
    }
  }

  render() {
    const { renderData } = this.state;
    // translate data to checkbox.
    return (
      <ConfigurationTable
        orderSpan={2}
        onChange={v => {
          const newSelected = v.filter(i => i.checked).map(i => i.name);
          this.setState(
            {
              renderData: v,
            },
            () => this.props.onChange(newSelected)
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
