import React from 'react';
import { Form, Button, Radio, message, Spin, Row, Col } from 'antd';
import CSVDataSink from './CSVDataSink';
import JDBCDataSink from './JDBCDataSink';

import styles from '../EditTask.less';

const sinks = {
  CSV: CSVDataSink,
  JDBC: JDBCDataSink,
};

const displaySinks = {
  CSV: 'CSV文件',
  JDBC: '数据库',
};

class SinkUnit extends React.PureComponent {
  state = {
    type: 'CSV',
  };

  render() {
    const { type } = this.state;
    const Comp = sinks[type];
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
            <div className={styles.describer}>配置输出: {info.name}</div>
            <div className={styles.description}>
              {' '}
              <span>{info.description}</span>{' '}
            </div>
            <div className={styles.describerPadding} />
          </Col>
        </Row>
        <div className={`${styles.middleWrapper} ${styles.switchWrapper}`}>
          <Radio.Group value={type} onChange={v => this.setState({ type: v.target.value })}>
            {Object.keys(displaySinks).map(key => (
              <Radio.Button value={key} key={key}>
                {displaySinks[key]}
              </Radio.Button>
            ))}
          </Radio.Group>
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

export default SinkUnit;
