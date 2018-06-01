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
        />
      </PageHeaderLayout>
    );
  }
}
