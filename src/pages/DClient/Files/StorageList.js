import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StorageFilePicker from '@/pages/Storage/StorageFilePicker';
import styles from './StorageList.less';

export default class StorageList extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper>
        <StorageFilePicker
          enableItemOp
          styles={styles}
          enableUpload
          enableMkdir
          mode="private"
          view="file"
          type="private"
          // view="index"
          // mode="public"
          // type="graph"
          // project={{ id: 1, name: '项目名1' }}
        />
      </PageHeaderWrapper>
    );
  }
}
