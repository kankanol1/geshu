import React, { PureComponent, Fragment } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DatasetDetailsComponent from './Details/DatasetDetailsComponent';

export default class DatasetDetail extends React.PureComponent {
  render() {
    const datasetId = this.props.match.params.id;
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
        <DatasetDetailsComponent datasetId={datasetId} />
      </PageHeaderLayout>
    );
  }
}
