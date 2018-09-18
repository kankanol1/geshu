import React from 'react';
import { Col, Row } from 'antd';
import styles from './SwitchSchemaWidget.less';
import CompositeWidget from '../CompositWidget';

export default class SwitchSchemaWidget extends CompositeWidget {
  render() {
    const { on } = this.state.formData;
    const { schema, name } = this.props;
    const { title, description } = schema;
    return (
      <div style={{ paddingBottom: '4px' }}>
        <Row>
          <Col span={16}>
            <span >
              {description === undefined ? (title === undefined ? name : title) : description}
            </span>
          </Col>
          <Col span={8} className={styles.hideInnerSpan}>{this.renderSchema('on')}</Col>
        </Row>
        {on ? this.renderSchema('schema') : null}
      </div>
    );
  }
}
