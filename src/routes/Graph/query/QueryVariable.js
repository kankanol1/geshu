
import React, { Component } from 'react';
import { Input, Button, Row, Col } from 'antd';
import styles from './QueryVariable.css';

export default class DynamicAttributeEditor extends Component {
  render() {
    return (
      <div>
        <div style={{ marginBottom: `${this.props.variableList.length > 0 ? 2 : 10}px`, textAlign: 'center', marginTop: 2 }}>
          <strong>变量调整</strong>
        </div>
        {
          this.props.variableList.map((attr, index) => {
            return (
              <div className={styles.attrItem} key={index}>
                <Row gutter={2}>
                  <Col span={9} style={{ marginLeft: '5%' }}>
                    <Input
                      placeholder="变量名称"
                      value={attr.variableName}
                      onChange={(event) => {
                        this.props.onUpdateAttr(index, 'variableName', event.target.value);
                      }}
                    />
                  </Col>
                  <Col span={9} style={{ marginLeft: 10 }}>
                    <Input
                      placeholder="变量值"
                      value={attr.variableDesc}
                      onChange={(event) => {
                        this.props.onUpdateAttr(index, 'variableDesc', event.target.value);
                      }}
                    />
                  </Col>
                  <Col span={2} style={{ marginTop: 2, marginLeft: 10 }}>
                    <Button shape="circle" icon="minus" size="small" onClick={this.props.onRemoveAttr.bind({}, index)} />
                  </Col>
                </Row>
              </div>
            );
          })
        }
        <div className={styles.attrItem}>
          <Button type="dashed" style={{ width: '90%', marginLeft: '5%' }} onClick={this.props.onAddAttr} icon="plus">
            添加
          </Button>
        </div>
      </div>
    );
  }
}
