import React from 'react';

import InputOutputConfig from './InputOutputConfig';

const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

export default class Output1Config extends React.Component {
  render() {
    return (
      <InputOutputConfig
        {...this.props}
        outputs={[{ label: '输出数据集', ...layout, name: 'output.0' }]}
      />
    );
  }
}
