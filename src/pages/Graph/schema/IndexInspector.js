import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Icon, List, Tag } from 'antd';
import IndexFormModal from './IndexFormModal';

@connect(({ graph_schema_editor }) => ({
  ...graph_schema_editor.indexData,
}))
class IndexInspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
    };
  }

  render() {
    const filteredIndex = [];
    for (const i in this.props.indexes) {
      if (this.props.indexes[i].name.indexOf(this.state.filterText) >= 0) {
        filteredIndex.push({ ...this.props.indexes[i], id: i });
      }
    }
    return (
      <div>
        <IndexFormModal
          visible={this.props.indexModal}
          onCancel={() => {
            this.props.dispatch({
              type: 'graph_schema_editor/hideIndexModal',
            });
          }}
          onSave={values => {
            this.props.dispatch({
              type: 'graph_schema_editor/saveOrUpdateIndex',
              payload: values,
            });
          }}
          data={this.props.currentIndexData}
        />
        <Input.Search
          placeholder="filter"
          onSearch={value => {
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
                <span
                  onClick={() => {
                    this.props.dispatch({
                      type: 'graph_schema_editor/showIndexModal',
                      payload: { id: item.id },
                    });
                  }}
                >
                  <Icon type="edit" style={{ marginRight: 8 }} />
                  编辑
                </span>,
                <span
                  onClick={() => {
                    this.props.dispatch({
                      type: 'graph_schema_editor/deleteIndex',
                      payload: { id: item.id },
                    });
                  }}
                >
                  <Icon type="delete" style={{ marginRight: 8 }} />
                  删除
                </span>,
              ]}
            >
              <List.Item.Meta
                title={
                  <div style={{ marginBottom: '-8px' }}>
                    <strong>
                      {item.name}（{item.type === 'node' ? '节点' : '关系'}
                      索引）
                    </strong>
                  </div>
                }
                description={`类型：${item.config}`}
              />
              <span>属性：</span>
              {item.properties.map((value, index) => {
                return (
                  <Tag color="blue" key={index}>
                    {value}
                  </Tag>
                );
              })}
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default IndexInspector;
