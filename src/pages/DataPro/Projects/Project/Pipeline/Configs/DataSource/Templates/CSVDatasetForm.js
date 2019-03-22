import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import FilePickerForForm from '@/pages/Storage/FilePickerForForm';
import { formItemWithError } from '../../Utils';

const CSVDatasetForm = props => {
  const { form, currentRecord, formItemProps, errors, onChange, validateErrors } = props;
  return (
    <React.Fragment>
      {formItemWithError(
        form,
        formItemProps,
        { valuePropName: 'checked' },
        errors,
        validateErrors,
        currentRecord,
        'format.ignoreFirstLine',
        false,
        '包含文件头',
        <Checkbox onChange={onChange} />
      )}
      {formItemWithError(
        form,
        formItemProps,
        {},
        errors,
        validateErrors,
        currentRecord,
        'format.fieldDelimiter',
        ',',
        '分隔符',
        <Input onChange={onChange} />
      )}
      {formItemWithError(
        form,
        formItemProps,
        {
          rules: [{ required: true, message: '文件路径不能为空' }],
        },
        errors,
        validateErrors,
        currentRecord,
        'source.path',
        undefined,
        '文件路径',
        <FilePickerForForm
          type="inline"
          allowSelectFolder={false}
          enableUpload
          enableMkdir
          mode="project"
          view="file"
          folderType="pipeline"
          project={{
            id: props.id,
            name: props.name,
          }}
          onChange={onChange}
        />
      )}
    </React.Fragment>
  );
};

export default CSVDatasetForm;
