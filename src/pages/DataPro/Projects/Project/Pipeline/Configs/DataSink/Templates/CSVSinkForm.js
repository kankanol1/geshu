import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import FilePickerForForm from '@/pages/Storage/FilePickerForForm';
import { formItemWithError } from '../../Utils';

const CSVSinkForm = props => {
  const { form, currentRecord, formItemProps, errors, onChange } = props;
  return (
    <React.Fragment>
      {/* {formItemWithError(
        form,
        formItemProps,
        { valuePropName: 'checked' },
        errors,
        currentRecord,
        'format.ignoreFirstLine',
        false,
        '包含文件头',
        <Checkbox onChange={onChange} />
      )} */}
      {formItemWithError(
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
        form,
        formItemProps,
        {
          rules: [{ required: true, message: '存储路径不能为空' }],
        },
        errors,
        currentRecord,
        'sink.path',
        '',
        '存储路径',
        <FilePickerForForm
          type="inline"
          allowSelectFolder
          folderOnly
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
      {formItemWithError(
        form,
        formItemProps,
        {
          rules: [
            { required: true, message: '文件名不能为空' },
            { pattern: /[a-zA-Z0-9]*/, message: '文件名仅允许字母及数字' },
          ],
        },
        errors,
        currentRecord,
        'sink.filename',
        '',
        '文件名',
        <Input onChange={onChange} />
      )}
    </React.Fragment>
  );
};

export default CSVSinkForm;
