import React from 'react';
import { Row, Col, Input, Button, Icon } from 'antd';
import styles from '../index.less';

export default class ObjectFieldTemplate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
    };
  }

  toggleState() {
    this.setState({ expand: !this.state.expand });
  }

  render() {
    const { required, TitleField, properties, title, description, schema, idSchema } = this.props;
    // if only one child, use inline.

    if (Object.keys(schema.properties).length === 1 &&
      schema.properties[Object.keys(schema.properties)[0]].properties === undefined &&
      schema.properties[Object.keys(schema.properties)[0]].type !== 'array') {
      let displayTitle = description === undefined ? title : description;
      if (schema.required && schema.required.length !== 0) {
        displayTitle += ' *';
      }
      const isCheckbox = schema.properties[Object.keys(schema.properties)[0]].type === 'boolean';
      return (
        <Row>
          <Col span={isCheckbox ? 16 : 8} >
            <TitleField title={displayTitle} />
          </Col>
          <Col span={isCheckbox ? 8 : 16} className={styles.hideInnerSpan} >
            {properties.map(prop => (
              <div
                key={prop.content.key}
              >
                {prop.content}
              </div>
            ))}
          </Col>
        </Row>
      );
    }

    let displayTitle = description === undefined ? title : description;
    if (required) {
      displayTitle += ' *';
    }
    const isRoot = idSchema.$id === 'root';
    return (
      <div className={isRoot ? null : styles.groupDiv}>
        <div onClick={() => this.toggleState()} className={styles.groupHeader} >
          {
          isRoot ? null :
          (
            <Row>
              <Col span={2} >
                <Icon type={this.state.expand ? 'down' : 'right'} className={styles.groupIcon} />
              </Col>
              <Col span={22} >
                <TitleField title={displayTitle} className={styles.groupLegend} />
              </Col>
            </Row>
          )
        }
        </div>
        { this.state.expand ?
        (
          <div className={isRoot ? null : styles.groupContent}>
            {properties.map(prop => (
              <div
                key={prop.content.key}
                className={isRoot ? styles.rootContent : null}
              >
                {prop.content}
              </div>
          ))}
          </div>
        )
        : null
        }
      </div>
    );
  }
}
