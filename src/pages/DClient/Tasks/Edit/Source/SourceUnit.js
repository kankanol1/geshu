import React from 'react';
import { Form, Button, Radio, message, Spin, Row, Col } from 'antd';
import CSVDataSource from './CSVDataSource';
import JDBCDataSource from './JDBCDataSource';

import styles from '../EditTask.less';

const sources = {
  CSV: CSVDataSource,
  JDBC: JDBCDataSource,
};

const displaySources = {
  CSV: 'CSV文件',
  JDBC: '数据库',
};

class SourceUnit extends React.PureComponent {
  state = {
    type: 'CSV',
  };

  render() {
    const { type } = this.state;
    const Comp = sources[type];
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
              {' '}
              <span>{info.description}</span>{' '}
            </div>
            <div className={styles.describerPadding} />
          </Col>
        </Row>
        <div className={`${styles.middleWrapper} ${styles.switchWrapper}`}>
          <Radio.Group value={type} onChange={v => this.setState({ type: v.target.value })}>
            {Object.keys(displaySources).map(key => (
              <Radio.Button value={key} key={key}>
                {displaySources[key]}
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

export default SourceUnit;
