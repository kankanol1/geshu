import React from 'react';

import SchemaOutputConfig from './SchemaOutputConfig';

const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

export default class SchemaOutput1Config extends React.Component {
  render() {
    return (
      <SchemaOutputConfig
        {...this.props}
        outputs={[{ label: '模式名称', ...layout, name: 'output.0', order: 0 }]}
      />
    );
  }
}
