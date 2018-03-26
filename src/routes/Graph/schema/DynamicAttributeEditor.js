import React, { Component } from 'react';
import { Input, Button, Select, Row, Col, Tooltip, Icon } from 'antd';
import styles from '../Inspectors.less';

const dataTypes = ['String', 'Character', 'Boolean', 'Byte', 'Short', 'Integer', 'Long', 'Float', 'Double', 'Date', 'Geoshape', 'UUID'];
const cardinalityTypes = ['SINGLE', 'LIST', 'SET'];
export default class DynamicAttributeEditor extends Component {
  render() {
    return (
      <div>
        <div style={{ marginBottom: `${this.props.attrList.length > 0 ? 2 : 10}px`, textAlign: 'center' }}>
          <Row>
            <Col span={7}><strong>属性名称</strong></Col>
            <Col span={7}><strong>属性类型</strong></Col>
            <Col span={7}>
              <strong>Cardinality</strong>
              <Tooltip title="Allowed cardinality of the values associated with the key on any given vertex">
                <Icon type="question-circle" />
              </Tooltip>
            </Col>
          </Row>
        </div>
        {
          this.props.attrList.map((attr, index) => {
            return (
              <div className={styles.attrItem} key={index}>
                <Row gutter={2}>
                  <Col span={7}>
                    <Input
                      placeholder="属性名称"
                      value={attr.name}
                      onChange={(event) => {
                        this.props.onUpdateAttr(index, 'name', event.target.value);
                      }}
                    />
                  </Col>
                  <Col span={7}>
                    <Select
                      showSearch
                      placeholder="属性类型"
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      filterOption={
                        (input, option) => {
                          return option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0;
                        }
                      }
                      value={attr.type}
                      onChange={(event) => {
                        this.props.onUpdateAttr(index, 'type', event);
                      }}
                    >
                      {dataTypes.map((value, i) => {
                        return (<Select.Option value={value} key={i}>{value}</Select.Option>);
                        })}
                    </Select>
                  </Col>
                  <Col span={7}>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      filterOption={
                        (input, option) => {
                          return option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0;
                        }
                      }
                      value={attr.cardinality}
                      onChange={(event) => {
                        this.props.onUpdateAttr(index, 'cardinality', event);
                      }}
                    >
                      {cardinalityTypes.map((value, i) => {
                        return (<Select.Option value={value} key={i}>{value}</Select.Option>);
                        })}
                    </Select>
                  </Col>
                  <Col span={2}>
                    <Button shape="circle" icon="minus" onClick={this.props.onRemoveAttr.bind({}, index)} />
                  </Col>
                </Row>
              </div>
            );
          })
        }
        <div className={styles.attrItem}>
          <Button type="dashed" style={{ width: '100%' }} onClick={this.props.onAddAttr} icon="plus">
            添加
          </Button>
        </div>
      </div>
    );
  }
}
