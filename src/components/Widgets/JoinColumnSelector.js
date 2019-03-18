import React from 'react';
import { Input, Checkbox } from 'antd';
import ConfigurationTable from '@/components/JsonSchemaForm/UI/ConfigurationTable';

export default class JoinColumnSelector extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      data: value || [],
    };
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    this.setState({
      data: value || [],
    });
  }

  render() {
    const { data } = this.state;
    const { schemas } = this.props;
    // translate data to checkbox.
    const renderData = [];
    Object.keys(schemas).forEach(k => {
      renderData.push(
        ...schemas[k].map(i => ({
          relation: k,
          name: `${k}_${i.name}`,
          disName: `${k}_${i.name}(${i.type})`,
          checked: data ? data.includes(`${k}_${i.name}`) : true,
        }))
      );
    });
    return (
      <ConfigurationTable
        onChange={v => {
          const newSelected = v.filter(i => i.checked).map(i => i.name);
          this.setState(
            {
              data: newSelected,
            },
            () => this.props.onChange(newSelected)
          );
        }}
        data={renderData}
        columns={[
          {
            name: 'relation',
            title: '来源',
            render: (v, item, onChange) => <Input defaultValue={v} value={v} disabled />,
            span: 4,
          },
          {
            name: 'disName',
            title: '列名',
            render: (v, item, onChange) => <Input defaultValue={v} value={v} disabled />,
            span: 14,
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
