import React from 'react';
import { Modal, message, Select, Input } from 'antd';
import { addTransformation } from '@/services/datapro/pipelineAPI';
import ConfigurationTable from '@/components/JsonSchemaForm/UI/ConfigurationTable';

import WithSchema from './WithSchema';

export default class RenameTransformation extends React.PureComponent {
  state = {
    formData: [],
    schema: [],
    adding: false,
  };

  handleOk() {
    const { id, opId, configs, onOk } = this.props;
    this.setState({ adding: true });
    // submit
    // translate fields.
    const fields = this.state.formData.map(i => i.fields);
    const names = this.state.formData.map(i => i.names);
    addTransformation({
      projectId: id,
      id: opId,
      config: { type: 'RenameTransformation', config: { fields, names } },
    }).then(response => {
      if (response) {
        if (response.success) {
          message.info('添加成功');
          onOk();
        } else {
          message.error(`添加失败:${response.message}，请重试`);
        }
      }
    });
  }

  renderForm() {
    const { schema, formData } = this.state;
    return (
      // <ColumnMappingWidget
      //   uiSchema={{
      //     'ui:options': {
      //       inputColumnTitle: '原列名',
      //       outputColumnTitle: '新列名',
      //       getField: () => {
      //         return this.state.schema;
      //       },
      //     },
      //   }}
      //   formData={{ value: this.state.formData }}
      //   onChange={v => this.setState({ formData: v.value })}
      // />
      <ConfigurationTable
        canAdd={schema && formData.length < schema.length}
        canDelete
        onChange={v =>
          this.setState({
            formData: v,
          })
        }
        data={formData}
        columns={[
          {
            name: 'fields',
            title: '原列名',
            render: (v, item, onChange) => (
              <Select placeholder="请选择" onChange={e => onChange(e)} value={v}>
                {schema.map(i => (
                  <Select.Option
                    key={i.name}
                    value={i.name}
                    disabled={formData.filter(s => s.fields === i.name).length > 0}
                  >
                    {`${i.name} (${i.type})`}
                  </Select.Option>
                ))}
              </Select>
            ),
            span: 11,
          },
          {
            name: 'names',
            title: '新列名',
            render: (v, item, onChange) => (
              <Input defaultValue={v} value={v} onChange={e => onChange(e.target.value)} />
            ),
            span: 11,
          },
        ]}
      />
    );
  }

  render() {
    const { onCancel } = this.props;
    return (
      <Modal
        title="重命名列"
        visible
        onOk={() => this.handleOk()}
        onCancel={onCancel}
        okButtonProps={{ loading: this.state.adding }}
      >
        <WithSchema
          {...this.props}
          onLoad={schema =>
            this.setState({
              schema,
              formData: (this.props.columns || []).map(i => ({ fields: i, names: i })),
            })
          }
        >
          {this.renderForm()}
        </WithSchema>
      </Modal>
    );
  }
}
