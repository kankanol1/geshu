import React from 'react';

import { formatMessage } from 'umi/locale';
import Input1Output1Config from './Input1Output1Config';
import Output1Config from './Output1Config';

// render config for other components.
const renderConfig = {
  AddLiteralColumnTransformer: Input1Output1Config,
  PrepareTransformer: Input1Output1Config,
  FilterTransformer: Input1Output1Config,
  FileDataSource: Output1Config,
};

export default class Index extends React.Component {
  render() {
    const { component, type, title, id, onOk, onCancel } = this.props;
    const Widget = renderConfig[component.code];
    const name =
      component.name ||
      formatMessage({
        id: `operator.${component.name}`,
        defaultMessage: component.name,
      });
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
