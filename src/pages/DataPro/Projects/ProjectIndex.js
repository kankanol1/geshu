import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import XTopBar from '@/components/XTopBar';

class ProjectIndex extends PureComponent {
  render() {
    return <PageHeaderWrapper top={<XTopBar title="xxxxProject" back="/projects/list" />} />;
  }
}

export default ProjectIndex;
