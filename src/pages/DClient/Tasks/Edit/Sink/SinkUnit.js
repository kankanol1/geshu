import React from 'react';
import { Form, Button, Radio, message, Spin, Row, Col } from 'antd';
import CSVDataSink from './CSVDataSink';
import JDBCDataSink from './JDBCDataSink';

import styles from '../EditTask.less';

const sinks = {
  FileDataSink: ['文件', CSVDataSink],
  JDBCDataSink: ['数据库', JDBCDataSink],
};

class SinkUnit extends React.PureComponent {
  state = {
    type: 'FileDataSink',
  };

  render() {
    const { type } = this.state;
    const Comp = sinks[type][1];
    const { form, id, info, currentRecord: gc } = this.props;
    const errors = {};
    const currentRecord = gc || {};

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
              <span>{info.description}</span>
            </div>
            <div className={styles.describerPadding} />
          </Col>
        </Row>
        <div className={`${styles.middleWrapper} ${styles.switchWrapper}`}>
          {form.getFieldDecorator(`${id}.componentType`, {
            initialValue: (currentRecord && currentRecord.componentType) || 'FileDataSink',
          })(
            <Radio.Group value={type} onChange={v => this.setState({ type: v.target.value })}>
              {Object.keys(sinks).map(key => (
                <Radio.Button value={key} key={key}>
                  {sinks[key][0]}
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

export default SinkUnit;
