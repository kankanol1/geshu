import React from 'react';
import { Form, Input, Col, Row, Button } from 'antd';
import { renderDescriber } from './Utils';

import styles from './PublishIndex.less';

@Form.create()
class PublishDescribeInput extends React.PureComponent {
  handleSubmit(e) {
    e.preventDefault();
    const { next, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // re-assemble values.
      next({ inputs: fieldsValue });
    });
  }

  render() {
    const { inputs } = this.props.meta;
    const { form, values } = this.props;
    return (
      <React.Fragment>
        {inputs.map((v, i) => renderDescriber(v, i, form, values && values.inputs))}
        <div className={styles.btnWrapper}>
          <Button type="primary" onClick={e => this.handleSubmit(e)}>
            下一步
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default PublishDescribeInput;
