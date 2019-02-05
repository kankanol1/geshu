import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import StorageFilePicker from '../../../Storage/StorageFilePicker';
import styles from './Files.less';

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  loading: loading.models.dataproProject,
}))
class Files extends PureComponent {
  render() {
    const { project } = this.props.dataproProject;
    const { id, name } = project;
    return (
      <StorageFilePicker
        enableItemOp
        styles={styles}
        enableUpload
        enableMkdir
        mode="project"
        view="file"
        type="pipeline"
        folderType="pipeline"
        project={{
          id,
          name,
        }}
      />
    );
  }
}

export default Files;
