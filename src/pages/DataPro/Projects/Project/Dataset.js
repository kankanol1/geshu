import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import router from 'umi/router';
import { Popconfirm, Card, Icon, Dropdown, Menu } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import CardTable from '@/components/CardTable';

import styles from './Dataset.less';

const defaultParams = {
  pageSize: 12,
  currentPage: 1,
};

@connect(({ dataproDatasets, loading }) => ({
  dataproDatasets,
  loading: loading.models.dataproDatasets,
}))
class Dataset extends PureComponent {
  state = {
    queryParams: defaultParams,
  };

  componentDidMount() {
    this.performQuery();
  }

  handleTableChange(pagination) {
    const newParams = {
      ...this.state.queryParams,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({ queryParams: newParams }, this.performQuery);
  }

  handleDelete(item) {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'dataproDatasets/deleteDataset',
      payload: {
        projectId: id,
        ids: [item.id],
      },
      callback: () => this.performQuery(),
    });
  }

  performQuery() {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'dataproDatasets/fetchAllDatasets',
      payload: {
        projectId: id,
        ...this.state.queryParams,
      },
    });
  }

  renderNoDataset = () => {
    return (
      <div className={styles.noDatasetWrapper}>
        <div style={{ paddingBottom: '20px' }}>
          <span style={{ fontWeight: '900' }}>未存储数据集</span>
        </div>
        <div>
          <span>可通过在已计算好的数据集上选择[存储数据集]，将数据集存储至此。</span>
        </div>
      </div>
    );
  };

  renderDatasetTable() {
    const { loading, match } = this.props;
    const { data } = this.props.dataproDatasets;
    const { id: projectId } = match.params;
    const datasetClicked = item => router.push(`/projects/p/dataset/${projectId}/${item.id}`);
    return (
      <CardTable
        className={styles.cardsWrapper}
        loading={loading}
        list={data.list}
        pagination={data.pagination}
        onChange={pagination => this.handleTableChange(pagination)}
        renderItem={item => (
          <div className={styles.cardWrapper} key={item.id}>
            <Card
              className={styles.card}
              // actions={[<a>查看</a>, <Link to={`/projects/p/show/${item.id}`}>打开</Link>]}
            >
              <Card.Meta
                title={
                  <div>
                    <a onClick={() => datasetClicked(item)}>{item.name}</a>
                    <div style={{ float: 'right' }}>
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item>
                              <Popconfirm
                                title={`确定删除数据集[${item.name}]？此操作不可恢复！`}
                                onConfirm={() => this.handleDelete(item)}
                                okText="确认删除"
                                cancelText="取消"
                              >
                                <a style={{ color: 'red' }}>
                                  删除
                                  {/* <Icon type="delete" /> */}
                                </a>
                              </Popconfirm>
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={['click']}
                      >
                        <a className="ant-dropdown-link" href="#">
                          <Icon type="ellipsis" />
                        </a>
                      </Dropdown>
                    </div>
                  </div>
                }
                description={
                  <Ellipsis className={styles.item} lines={3}>
                    {item.description}
                  </Ellipsis>
                }
              />
            </Card>
          </div>
        )}
      />
    );
  }

  render() {
    const { loading } = this.props;
    const { data } = this.props.dataproDatasets;
    // if (Object.keys(data.pagination) === 0) {
    //   return this.renderNoDataset();
    // }
    return this.renderDatasetTable();
  }
}

export default Dataset;
