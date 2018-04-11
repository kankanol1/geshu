import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Popconfirm, Dropdown, Icon, Table, Row, Col, Card, Form, Input, Button, Menu, DatePicker, Divider } from 'antd';

@connect(({ loading, graph_query }) => ({
  graph_query,
  loading: loading.models.graph_query,
}))
export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '名称',
      dataIndex: 'name',
      width: '45%',
      render: (text, record) => {
        const { editable, name, id } = record;
        return (
          <div>
            {editable
          ? (
            <span>
              <Input
                size="small"
                style={{ margin: '-5px 5px', width: '65%' }}
                value={name}
                onChange={e => this.handleChange(e.target.value, id, 'name')}
              />
              <Button.Group>
                <Button type="primary" icon="check" size="small" onClick={this.save.bind(this, id, 'name')} />
                <Button icon="close" size="small" onClick={this.cancel.bind(this, id, 'name')} />
              </Button.Group>

            </span>
          )
          : (
            <span>
              <span style={{ margin: '-5px 5px' }}>{name}</span>
              <a onClick={() => this.edit(id)}><Icon type="edit" />编辑</a>
            </span>
    )
        }
          </div>
        );
      },
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '100px',
      render: (text, record) => {
        return (
          <div>
            <a onClick={() => this.props.onOpen(record.query)}>打开</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="确认删除吗?" onConfirm={() => this.delete(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          </div>
        );
      },
    }];
    this.state = { data: [] };
  }
  componentWillReceiveProps(newProps) {
    this.setState({ data: newProps.graph_query.queries.map(item => ({ ...item })) });
  }
  handleChange(value, id, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  delete(id) {
    this.props.dispatch({
      type: 'graph_query/removeQuery',
      payload: { ids: [id] },
    });
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.id)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(id) {
    const target = this.state.data.filter(item => id === item.id)[0];
    this.props.dispatch({
      type: 'graph_query/updateQuery',
      payload: { ...target },
    });
  }
  cancel(id, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => id === item.id)[0];
    const origin = this.props.graph_query.queries.filter(item => id === item.id)[0];
    if (target && origin) {
      target[column] = origin[column];
      target.editable = false;
      this.setState({ data: newData });
    }
  }
  render() {
    return (
      <Table
        loading={this.props.loading}
        bordered
        dataSource={this.state.data}
        columns={this.columns}
        size="small"
        scroll={{ y: 300 }}
        rowKey="id"
      />
    );
  }
}
