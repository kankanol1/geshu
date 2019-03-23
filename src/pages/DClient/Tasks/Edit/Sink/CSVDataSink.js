import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import FilePickerForForm from '@/pages/Storage/FilePickerForForm';
import { formItemWithError } from '../Utils';

const CSVDataSink = props => {
  const { form, currentRecord, formItemProps, errors, onChange, prefix } = props;
  return (
    <React.Fragment>
      {formItemWithError(
        prefix,
        form,
        formItemProps,
        { valuePropName: 'checked' },
        errors,
        currentRecord,
        'format.ignoreFirstLine',
        false,
        '包含文件头',
        <Checkbox onChange={onChange} />
      )}
      {formItemWithError(
        prefix,
        form,
        formItemProps,
        {},
        errors,
        currentRecord,
        'format.fieldDelimiter',
        ',',
        '分隔符',
        <Input onChange={onChange} />
      )}
      {formItemWithError(
        prefix,
        form,
        formItemProps,
        {
          rules: [{ required: true, message: '文件路径不能为空' }],
        },
        errors,
        currentRecord,
        'sink.path',
        '',
        '文件路径',
        <FilePickerForForm
          type="inline"
          allowSelectFolder={false}
          enableUpload
          enableMkdir
          mode="project"
          view="file"
          folderType="private"
          onChange={onChange}
        />
      )}
      {formItemWithError(
        prefix,
        form,
        formItemProps,
        {},
        errors,
        currentRecord,
        'sink.name',
        '',
        '输出文件名',
        <Input onChange={onChange} />
      )}
    </React.Fragment>
  );
};

export default CSVDataSink;
