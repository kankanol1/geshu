import React from 'react';
import { Form, Input, Col, Row, Button } from 'antd';
import { renderDescriber } from './Utils';

import styles from './PublishIndex.less';

@Form.create()
class PublishDescribeOutput extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    const { next, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // re-assemble values.
      next({ outputs: fieldsValue });
    });
  }

  render() {
    const { outputs } = this.props.meta;
    const { form, back } = this.props;
    return (
      <React.Fragment>
        {outputs.map((v, i) => renderDescriber(v, i, form))}
        <div className={styles.btnWrapper}>
          <Button onClick={e => back()}>上一步</Button>
          <Button type="primary" onClick={e => this.handleSubmit(e)}>
            下一步
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default PublishDescribeOutput;
