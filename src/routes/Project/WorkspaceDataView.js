import React, { Component } from 'react';
import { Layout, Card, Input, Button, Select } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import WorkspaceViewMenu from './WorkspaceViewMenu';
import WorkspaceMenu from './Workspace/Menu/WorkspaceMenu';
import { makeData } from '../../utils/Fake';

import styles from './WorkspaceDataView.less';

const { Option } = Select;
const { Header } = Layout;
const { TextArea } = Input;

export default class WorkspaceDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: makeData(),
    };
  }

  render() {
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light" >
        <Header style={{ padding: '0px', height: '48px', lineHeight: '46px', background: '#eee' }}>
          <WorkspaceMenu env={['dataview']} />
          <WorkspaceViewMenu currentPath={this.props.location} />
        </Header>
        <Layout style={{ padding: '0', height: '100%' }} theme="light">
          <Card>
            <TextArea rows={4} placeholder="enter sql here." />
            <div className={styles.buttonContainer}>
              <span> From </span>
              <Select defaultValue="lucy" style={{ width: 240 }} onChange={this.handleChange}>
                <Option value="jack">Component1 Output</Option>
                <Option value="lucy">Component2 Output</Option>
                <Option value="disabled">Component3 Output1</Option>
                <Option value="Yiminghe">Component3 Output2</Option>
              </Select>
              <Button type="primary" className={styles.button}>查询</Button>
              <Button type="danger" className={styles.button}>清空</Button>
            </div>
          </Card>
          <Card>
            <ReactTable
              data={this.state.data}
              columns={[
                {
                  Header: 'Name',
                  columns: [
                    {
                      Header: 'First Name',
                      accessor: 'firstName',
                    },
                    {
                      Header: 'Last Name',
                      id: 'lastName',
                      accessor: d => d.lastName,
                    },
                  ],
                },
                {
                  Header: 'Info',
                  columns: [
                    {
                      Header: 'Age',
                      accessor: 'age',
                    },
                    {
                      Header: 'Status',
                      accessor: 'status',
                    },
                  ],
                },
                {
                  Header: 'Status',
                  columns: [
                    {
                      Header: 'Visits',
                      accessor: 'visits',
                    },
                  ],
                },
              ]}
              defaultPageSize={10}
              className="-striped -highlight"
            />
          </Card>
        </Layout>
      </Layout>
    );
  }
}
