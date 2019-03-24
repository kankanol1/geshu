import React from 'react';
import { Select, Input, Checkbox } from 'antd';
import FilePickerForForm from '@/pages/Storage/FilePickerForForm';
import { formItemWithError } from '../Utils';

const formRegistry = {
  // first would be the default.
  'com.gldata.gaia.pipeline.api.dataset.formats.CsvFormat': 'CSV',
};

const CSVDataSink = props => {
  const { form, currentRecord, formItemProps, errors, onChange, prefix } = props;
  return (
    <React.Fragment>
      {formItemWithError(
        prefix,
        form,
        formItemProps,
        {},
        errors,
        currentRecord,
        'format.formatClass',
        'com.gldata.gaia.pipeline.api.dataset.formats.CsvFormat',
        '文件类型',
        <Select onChange={onChange}>
          {Object.keys(formRegistry).map((k, i) => (
            <Select.Option key={i} value={k}>
              {formRegistry[k]}
            </Select.Option>
          ))}
        </Select>
      )}
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
          rules: [{ required: true, message: '存储路径不能为空' }],
        },
        errors,
        currentRecord,
        'sink.path',
        undefined,
        '存储路径',
        <FilePickerForForm
          type="inline"
          allowSelectFolder={false}
          enableUpload
          enableMkdir
          mode="project"
          view="file"
          folderType="private"
          onChange={onChange}
          createMode
        />
      )}
    </React.Fragment>
  );
};

export default CSVDataSink;
