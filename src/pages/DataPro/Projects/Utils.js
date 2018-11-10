import React from 'react';
import { Icon } from 'antd';
import XTopBar from '@/components/XTopBar';

export function renderTopBar(id, title, path) {
  return (
    <XTopBar
      title={title}
      back="/projects/list"
      location={path}
      menus={[
        {
          tooltip: '概览',
          key: 'overview',
          link: `/projects/p/show/${id}`,
          content: <Icon type="profile" />,
        },
        {
          tooltip: '数据处理流程',
          key: 'pipeline',
          link: `/projects/p/pipeline/${id}`,
          content: <Icon type="share-alt" />,
        },
        {
          tooltip: '数据集',
          key: 'dataset',
          link: `/projects/p/dataset/${id}`,
          content: <Icon type="file-text" />,
        },
        {
          tooltip: '看板',
          key: 'dashboard',
          link: `/projects/p/dashboard/${id}`,
          content: <Icon type="fund" />,
        },
        {
          tooltip: '历史版本',
          key: 'versions',
          link: `/projects/p/versions/${id}`,
          content: <Icon type="clock-circle" />,
        },
        {
          tooltip: '项目设置',
          key: 'settings',
          link: `/projects/p/settings/${id}`,
          content: <Icon type="setting" />,
        },
      ]}
    />
  );
}