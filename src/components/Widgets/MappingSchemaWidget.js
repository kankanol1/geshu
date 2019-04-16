import React from 'react';
import { Select, Input } from 'antd';
import ConfigurationTable from '@/components/JsonSchemaForm/UI/ConfigurationTable';
import styles from './WidgetStyles.less';

class MappingSchemaWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      data: value || [],
    };
  }

  componentDidMount() {
    // set value.
    const { objSchema, inputSchema } = this.props;
    if (this.state.data.length === 0) {
      const data = objSchema.map(i => ({
        name: i.name,
        from: undefined,
        type: i.type,
        nullable: i.nullable,
      }));
      this.setState({ data });
    }
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    this.setState({
      data: value || [],
    });
  }

  render() {
    const { objSchema, inputSchema } = this.props;
    return (
      <ConfigurationTable
        canAdd={false}
        canDelete={false}
        onChange={v =>
          this.setState(
            {
              data: v,
            },
            () => this.props.onChange(v)
          )
        }
        data={this.state.data}
        columns={[
          {
            name: 'name',
            title: '目标列',
            render: (v, item, onChange, index) => (
              <div className={styles.fakeInput}>
                {v}({item.type})
              </div>
            ),
            span: 11,
          },
          {
            name: 'from',
            title: '输入列',
            render: (v, item, onChange) => (
              <Select placeholder="请选择" onChange={e => onChange(e)} value={v}>
                {inputSchema.map(i => (
                  <Select.Option key={i.name} value={i.name} disabled={i.type !== item.type}>
                    {`${i.name} (${i.type})`}
                  </Select.Option>
                ))}
              </Select>
            ),
            span: 11,
          },
        ]}
      />
    );
  }
}

export default MappingSchemaWidget;
