import React, { Fragment } from 'react';
import { Popconfirm, Card, Button, Divider, Tag } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import styles from './Template.less';
import XHelp from '@/components/XHelp';

@connect(({ dataproTemplates, loading }) => ({
  dataproTemplates,
  loading: loading.models.dataproTemplates,
}))
class Template extends React.PureComponent {
  state = {
    selectedRows: [],
  };

  refreshParams = [];

  componentDidMount() {
    this.performQuery({});
  }

  getColumns = () => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '50%',
      },
      // {
      //   title: '更新时间',
      //   dataIndex: 'updatedAt',
      //   sorter: true,
      //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      // },
      {
        title: '发布时间',
        dataIndex: 'createdAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        width: 250,
        render: (text, record) => (
          <Fragment>
            <Button
              type="primary"
              size="small"
              // onClick={() => router.push(`/tasks/t/show/${record.id}`)}
            >
              应用
            </Button>
            <Divider type="vertical" />
            <Button
              // type="primary"
              size="small"
              // onClick={() => router.push(`/tasks/t/show/${record.id}`)}
            >
              修改
            </Button>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="确认删除吗?" onConfirm={() => this.handleRecordDelete(record)}>
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            </span>
            <XHelp tip="删除后不可再使用该模版创建新任务，但已创建任务仍可运行" />
          </Fragment>
        ),
      },
    ];
  };

  performQuery = params => {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'dataproTemplates/fetchTemplates',
      payload: {
        projectId: id,
        ...params,
      },
    });
    this.refreshParams = params;
  };

  handleSelectRows = rows => {
    this.setState({
      ...this.state,
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.performQuery(params);
  };

  handleMultiDelete = () => {
    const { dispatch } = this.props;
    const ids = this.state.selectedRows.map(record => record.id);
    dispatch({
      type: 'dataproTemplates/deleteTemplate',
      payload: {
        ids,
      },
      callback: () => this.performQuery(this.refreshParams),
    });
    // update selection.
    this.setState({
      ...this.state,
      selectedRows: [],
    });
  };

  handleRecordDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataproTemplates/deleteTemplate',
      payload: {
        ids: [record.id],
      },
      callback: () => this.performQuery(this.refreshParams),
    });
  };

  render() {
    const { loading, match } = this.props;
    const { data } = this.props.dataproTemplates;
    const { id: projectId } = match.params;
    const { selectedRows } = this.state;
    return (
      <Card>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button
              icon="sync"
              type="primary"
              onClick={() => this.performQuery(this.refreshParams)}
            >
              刷新
            </Button>
            <Popconfirm title="确认删除吗?" onConfirm={() => this.handleMultiDelete()}>
              {selectedRows.length > 0 && <Button>批量删除</Button>}
            </Popconfirm>
          </div>
        </div>
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          columns={this.getColumns()}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
      </Card>
    );
  }
}

export default Template;
