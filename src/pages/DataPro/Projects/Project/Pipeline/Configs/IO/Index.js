import React from 'react';
import { Modal } from 'antd';

import { formatMessage } from 'umi/locale';
import Input1Output1Config from './Input1Output1Config';
import Input1Output2Config from './Input1Output2Config';
import Input2Output1Config from './Input2Output1Config';
import Output1Config from './Output1Config';
import Input1Config from './Input1Config';
import SchemaOutput1Config from './SchemaOutput1Config';
import MappingIOConfig from './MappingIOConfig';

// render config for other components.
const renderConfig = {
  // sources.
  FileDataSource: Output1Config,
  JDBCDataSource: Output1Config,

  // sinks
  FileDataSink: Input1Config,

  // transformers.
  AddLiteralColumnTransformer: Input1Output1Config,
  PrepareTransformer: Input1Output1Config,
  FilterTransformer: Input1Output1Config,
  SplitTransformer: Input1Output2Config,
  JoinTransformer: Input2Output1Config,
  AggregateTransformer: Input1Output1Config,

  // schema
  DefineSchemaSource: SchemaOutput1Config,
  MappingOperator: MappingIOConfig,
};

export default class Index extends React.Component {
  render() {
    const { component, type, title, id, onOk, onCancel } = this.props;
    const Widget = renderConfig[component.code];
    if (!Widget) {
      return (
        <Modal title={title} visible onOk={onCancel} onCancel={onCancel}>
          Not implemented.
        </Modal>
      );
    }
    const name =
      type === 'new'
        ? formatMessage({
            id: `operator.${component.name}`,
            defaultMessage: component.name,
          })
        : component.name;
    return (
      <Widget
        projectId={id}
        componentId={component && component.id}
        initInputs={(component && component.inputs) || []}
        initOutputs={(component && component.outputs) || []}
        type={type}
        name={name}
        title={title}
        // type.
        code={component.code}
        onOk={onOk}
        onCancel={onCancel}
      />
    );
  }
}
