import React from 'react';
import DefineSchemaWidget from '@/components/Widgets/DefineSchemaWidget';
import TwoSchemaMappingWidget from '@/components/Widgets/TwoSchemaMappingWidget';
import { formItemWithError, expandValidateErrors } from '../../Utils';

class DefineSchema extends React.PureComponent {
  render() {
    const { form, formItemProps, currentRecord, validateErrors, errors } = this.props;
    return (
      <React.Fragment>
        {formItemWithError(
          form,
          formItemProps,
          {
            rules: [{ required: true, message: '数据集类型不能为空' }],
          },
          errors,
          validateErrors,
          currentRecord,
          'schema',
          {},
          '输出模式',
          <DefineSchemaWidget />
        )}
      </React.Fragment>
    );
  }
}

export default DefineSchema;
