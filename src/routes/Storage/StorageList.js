import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Modal, Icon, message, Card, List, Tooltip } from 'antd';
import request from '../../utils/request';
import urls from '../../utils/urlUtils';
import { extractFileName } from '../../utils/conversionUtils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import UploadModal from './UploadModal';
import CreateModal from './CreateModal';
import RenameModal from './RenameModal';
import DeleteModal from './DeleteModal';
import StorageFilePicker from './StorageFilePicker';
import { indexListData } from './StorageUtils';
// import styles from './StorageList.less';
import styles from './StorageFilePicker.less';

export default class StorageList extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <StorageFilePicker
          enableItemOp
          styles={styles}
          enableUpload
          enableMkdir
          allowSelectFolder
        />
      </PageHeaderLayout>
    );
  }
}
