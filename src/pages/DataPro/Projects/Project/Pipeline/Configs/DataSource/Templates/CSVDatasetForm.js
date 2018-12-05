import React, { PureComponent } from 'react';
import { Form, Input, Checkbox } from 'antd';
import FilePickerForForm from '@/pages/Storage/FilePickerForForm';

const FormItem = Form.Item;

const CSVDatasetForm = props => {
  const { form, currentRecord, formItemProps } = props;
  const format = currentRecord && currentRecord.format;
  const source = currentRecord && currentRecord.source;
  return (
    <React.Fragment>
      <FormItem {...formItemProps} label="包含文件头">
        {form.getFieldDecorator('format.ignoreFirstLine', {
          initialValue: format ? format.ignoreFirstLine || false : false,
          valuePropName: 'checked',
        })(<Checkbox />)}
      </FormItem>
      <FormItem {...formItemProps} label="分隔符">
        {form.getFieldDecorator('format.fieldDelimiter', {
          initialValue: (format && format.fieldDelimiter) || ',',
        })(<Input />)}
      </FormItem>
      <FormItem {...formItemProps} label="文件路径">
        {form.getFieldDecorator('source.path', {
          rules: [{ required: true, message: '文件路径不能为空' }],
          initialValue: source ? source.path || '' : '',
        })(
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
          />
        )}
      </FormItem>
    </React.Fragment>
  );
};

export default CSVDatasetForm;
