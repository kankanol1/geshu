import React from 'react';
import { Row, Col, Input, Button, Icon } from 'antd';
import styles from '../../index.less';
import CompositeWidget from '../CompositWidget';

export default class TunableNumberWidget extends CompositeWidget {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
      formData: { ...props.formData },
    };
  }

  render() {
    const { required, properties, schema, idSchema, registry } = this.props;

    const { TitleField } = registry.fields;
    const { title, description } = schema;
    let displayTitle = description === undefined ? title : description;
    if (required) {
      displayTitle += ' *';
    }
    const isRoot = idSchema.$id === 'root';
    return (
      <div className={isRoot ? null : styles.groupDiv}>
        <div onClick={() => this.toggleState()} className={styles.groupHeader}>
          {
          isRoot ? null
            : (
              <Row>
                <Col span={2}>
                  <Icon type={this.state.expand ? 'down' : 'right'} className={styles.groupIcon} />
                </Col>
                <Col span={22}>
                  <TitleField title={displayTitle} className={styles.groupLegend} />
                </Col>
              </Row>
            )
        }
        </div>
        { this.state.expand
          ? (
            <div className={isRoot ? null : styles.groupContent}>
              {this.renderSchema('tunableType')}
              {this.renderSchema('tunableValue')}
              {this.renderSchema('value')}
            </div>
          )
          : null
        }
      </div>
    );
  }
}
