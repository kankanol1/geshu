import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { formItemWithError } from '../Utils';

const JDBCDataSource = props => {
  const { form, currentRecord, formItemProps, errors, onChange } = props;
  return (
    <React.Fragment>
      {formItemWithError(
        form,
        formItemProps,
        {},
        errors,
        currentRecord,
        'url',
        'jdbc://',
        '数据库连接地址',
        <Input onChange={onChange} />
      )}
      {formItemWithError(
        form,
        formItemProps,
        {},
        errors,
        currentRecord,
        'userName',
        '',
        '用户名',
        <Input onChange={onChange} />
      )}
      {formItemWithError(
        form,
        formItemProps,
        {},
        errors,
        currentRecord,
        'password',
        '',
        '密码',
        <Input onChange={onChange} type="password" />
      )}
    </React.Fragment>
  );
};

export default JDBCDataSource;
