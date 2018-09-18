import React from 'react';
import { Tabs, Card } from 'antd';

import DetailOverview from './DetailOverview';
import DetailTable from './DetailTable';

const { TabPane } = Tabs;

const DatasetDetailsComponent = (props) => {
  return (
    <Card
      title="数据查看"
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="概览" key="1">
          <DetailOverview datasetId={props.datasetId} type={props.type} />
        </TabPane>
        <TabPane tab="数据" key="2">
          <DetailTable datasetId={props.datasetId} type={props.type} />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default DatasetDetailsComponent;
