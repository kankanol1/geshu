import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StorageFilePicker from './StorageFilePicker';
import styles from './StorageList.less';

export default class StorageList extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <StorageFilePicker
          enableItemOp
          styles={styles}
          enableUpload
          enableMkdir
          // view="index"
          // mode="project"
          // type="graph"
          // project={{ id: 1, name: '项目名1' }}
        />
      </PageHeaderLayout>
    );
  }
}
