import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DetailOverview from './Details/DetailOverview';
import DetailTable from './Details/DetailTable';

const { TabPane } = Tabs;

@connect(() => ({
}))
export default class DatasetDetail extends React.Component {
  componentWillUnmount() {
    this.props.dispatch({
      type: 'databassedetail/clearData',
    });
  }

  render() {
    const tableId = this.props.match.params.table;
    return (
      <PageHeaderLayout
        breadcrumbList={[{
            title: '首页',
            href: '/',
          }, {
            title: '数据集列表',
            href: '/storage/dataset',
          }, {
            title: '数据集查看',
          }]}
      >
        <Card
          title="数据表"
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="概览" key="1">
              <DetailOverview tableId={tableId} />
            </TabPane>
            <TabPane tab="数据" key="2">
              <DetailTable tableId={tableId} />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
