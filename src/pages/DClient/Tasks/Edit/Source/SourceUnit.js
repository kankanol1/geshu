import React from 'react';
import { Form, Button, Radio, message, Spin, Row, Col } from 'antd';
import CSVDataSource from './CSVDataSource';
import JDBCDataSource from './JDBCDataSource';
import { formItemWithError } from '../Utils';

import styles from '../EditTask.less';

const sources = {
  FileDataSource: ['文件', CSVDataSource],
  JDBCDataSource: ['数据库', JDBCDataSource],
};

class SourceUnit extends React.PureComponent {
  state = {
    type: 'FileDataSource',
  };

  render() {
    const { type } = this.state;
    const Comp = sources[type][1];
    const { form, id, info, currentRecord } = this.props;
    const errors = {};

    const formItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <React.Fragment>
        <Row>
          <Col span={20} offset={2}>
            <div className={styles.describer}>配置输入: {info.name}</div>
            <div className={styles.description}>
              <span>{info.description}</span>
            </div>
            <div className={styles.describerPadding} />
          </Col>
        </Row>
        <div className={`${styles.middleWrapper} ${styles.switchWrapper}`}>
          {form.getFieldDecorator(`${id}.componentType`, {
            initialValue: 'FileDataSource',
          })(
            <Radio.Group value={type} onChange={v => this.setState({ type: v.target.value })}>
              {Object.keys(sources).map(key => (
                <Radio.Button value={key} key={key}>
                  {sources[key][0]}
                </Radio.Button>
              ))}
            </Radio.Group>
          )}
        </div>
        <Comp
          errors={errors}
          form={form}
          prefix={id}
          currentRecord={currentRecord}
          formItemProps={formItemProps}
        />
      </React.Fragment>
    );
  }
}

export default SourceUnit;
