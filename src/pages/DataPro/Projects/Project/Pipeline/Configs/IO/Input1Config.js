import React from 'react';

import InputOutputConfig from './InputOutputConfig';

const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

export default class Input1Config extends React.Component {
  render() {
    return (
      <InputOutputConfig
        {...this.props}
        inputs={[{ label: '输入数据集', ...layout, name: 'input.0', order: 0 }]}
      />
    );
  }
}
