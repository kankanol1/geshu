import React, { PureComponent } from 'react';
import { Form, Input, Checkbox } from 'antd';
import FilePickerForForm from '../../Storage/FilePickerForForm';

const FormItem = Form.Item;

const CSVDatasetForm = (props) => {
  const { form, currentRecord, formItemProps } = props;
  const properties = currentRecord ? currentRecord.properties : undefined;
  return (
    <React.Fragment>
      <FormItem
        {...formItemProps}
        label="包含文件头"
      >
        {form.getFieldDecorator('properties.header', {
              initialValue: properties ? properties.header || false : false,
              valuePropName: 'checked',
      })(
        <Checkbox />
      )}
      </FormItem>
      <FormItem
        {...formItemProps}
        label="文件路径"
      >
        {form.getFieldDecorator('properties.path', {
        rules: [{ required: true, message: '文件路径不能为空' }],
        initialValue: properties ? properties.path || '' : '',
      })(
        <FilePickerForForm type="inline" allowSelectFolder={false} />
      )}
      </FormItem>
    </React.Fragment>
  );
};

export default CSVDatasetForm;
