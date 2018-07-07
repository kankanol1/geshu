
import React from 'react';
import { Card } from 'antd';

const ErrorListTemplate = (props) => {
  const { errors } = props;
  return (
    <Card type="inner" title="配置项错误" style={{ background: 'transparent' }}>
      <ul className="list-group">
        {errors.map((error, i) => {
        return (
          <li key={i} className="list-group-item text-danger">
            {error.stack}
          </li>
        );
      })}
      </ul>
    </Card>
  );
};

export default ErrorListTemplate;
