import React, { Component } from 'react';
import { Input, Icon, List, Tag } from 'antd';
import IndexFormModal from './IndexFormModal';


export default class IndexInspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      indexes: [],
      modifyingData: {},
      modifyingIndex: -1,
      filterText: '',
    };
  }
  add=() => {
    this.setState({
      showModal: true,
      modifyingData: {},
      modifyingIndex: -1,
    });
  }
  modify=(index) => {
    this.setState({
      showModal: true,
      modifyingData: this.state.indexes[index],
      modifyingIndex: index,
    });
  }
  remove=(index) => {
    this.state.indexes.splice(index, 1);
    this.setState({});
  }
  handleSaveOrUpdate = (values) => {
    if (this.state.modifyingIndex >= 0) {
      this.state.indexes[this.state.modifyingIndex] = values;
    } else { this.state.indexes = this.state.indexes.concat(values); }
    this.setState({
      showModal: false,
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    const filteredIndex = [];
    for (const i in this.state.indexes) {
      if (this.state.indexes[i].name.indexOf(this.state.filterText) >= 0) {
        filteredIndex.push(this.state.indexes[i]);
      }
    }
    return (
      <div>
        <IndexFormModal
          visible={this.state.showModal}
          onCancel={() => { this.setState({ showModal: false }); }}
          onSave={this.handleSaveOrUpdate}
          ref={this.saveFormRef}
          data={this.state.modifyingData}
        />
        <Input.Search
          placeholder="filter"
          onSearch={(value) => {
            this.setState({ filterText: value });
          }}
        />
        <List
          itemLayout="vertical"
          dataSource={filteredIndex}
          size="small"
          bordered
          renderItem={(item, key) => (
            <List.Item
              key={key}
              actions={[
                    (<span onClick={this.modify.bind({}, key)}><Icon type="edit" style={{ marginRight: 8 }} />编辑</span>),
                    (<span onClick={this.remove.bind({}, key)}><Icon type="delete" style={{ marginRight: 8 }} />删除</span>),
                ]}
            >
              <List.Item.Meta
                title={<div style={{ marginBottom: '-8px' }}><strong>{item.name}（{item.type === 'node' ? '节点' : '关系'}索引）</strong></div>}
                description={`类型：${item.config}`}
              />
              <span>属性：</span>
              {
                  item.properties.map((value, index) => {
                      return (
                        <Tag color="blue" key={index}>{value}</Tag>
                  );
                })
              }
            </List.Item>)}
        />
      </div>
    );
  }
}
