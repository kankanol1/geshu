import React, { Component } from 'react';
import { Input, Icon, Button, Select, Row, Col } from 'antd';
import styles from './ElementInspector.less';

export default class DynamicAttributeEditor extends Component {
  render() {
    return (
      <div>
        {
          this.props.attrList.map((attr, index) => {
            return (
              <div className={styles.attrItem} key={index}>
                <Row gutter={2}>
                  <Col span={12}>
                    <Input
                      placeholder="属性名称"
                      value={attr.name}
                      onChange={(event) => {
                        this.props.onUpdateAttr(index, 'name', event.target.value);
                      }}
                    />
                  </Col>
                  <Col span={10}>
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
                      <Select.Option value="string">string</Select.Option>
                      <Select.Option value="float">float</Select.Option>
                      <Select.Option value="integer">integer</Select.Option>
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
