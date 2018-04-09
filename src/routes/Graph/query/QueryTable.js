import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Popconfirm, Dropdown, Icon, Table, Row, Col, Card, Form, Input, Button, Menu, DatePicker, Divider } from 'antd';
import StandardTable from '../../../components/StandardTable';


const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

@connect(({ graph, loading }) => ({
  graph,
  loading: loading.models.project,
}))
export default class EditableTable extends React.Component {
  render() {
    return <Table bordered dataSource={this.state.data} columns={this.columns} />;
  }
}
