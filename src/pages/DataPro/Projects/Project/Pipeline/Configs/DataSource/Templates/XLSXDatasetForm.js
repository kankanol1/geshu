import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import FilePickerForForm from '@/pages/Storage/FilePickerForForm';
import { formItemWithError } from '../../Utils';
import XHelp from '@/components/XHelp';

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
        'format.ignoreFirstRow',
        false,
        '忽略第一行',
        <Checkbox onChange={onChange} />
      )}
      {formItemWithError(
        form,
        formItemProps,
        {},
        errors,
        validateErrors,
        currentRecord,
        'format.sheetName',
        'Sheet1',
        <span>
          表格名 <XHelp tip="表格名一般位于Excel文件下方，通常默认为Shee1" />
        </span>,
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
