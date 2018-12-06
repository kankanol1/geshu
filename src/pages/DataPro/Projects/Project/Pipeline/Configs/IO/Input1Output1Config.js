import React from 'react';

import InputOutputConfig from './InputOutputConfig';

const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

export default class Input1Output1Config extends React.Component {
  render() {
    return (
      <InputOutputConfig
        {...this.props}
        inputs={[{ label: undefined, ...layout, name: 'input.0', order: 0 }]}
        outputs={[{ label: undefined, ...layout, name: 'output.0', order: 0 }]}
      />
    );
  }
}
