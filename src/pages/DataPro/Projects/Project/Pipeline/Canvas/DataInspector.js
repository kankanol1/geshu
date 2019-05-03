import React from 'react';
import { Modal, Button, Icon, Table, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import XDataTable from '@/components/XDataTable';
import styles from './DataInspector.less';

class DataInspector extends React.Component {
  componentWillMount() {
    this.performQuery();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'dataproInspector/clearData',
    });
  }

  performQuery() {
    this.props.dispatch({
      type: 'dataproInspector/inspectData',
      payload: {
        id: this.props.projectId,
        component: this.props.component.id,
        error: this.props.component.error,
        limit: 100,
      },
    });
  }

  renderColumnTitle = (schema, type) => {
    if (schema.name === '___message___') {
      return (
        <div className={styles.columnHeader}>
          <div className={styles.columnName}>错误信息</div>
        </div>
      );
    }
    return (
      <div className={styles.columnHeader}>
        <div className={styles.columnName}>{schema.name}</div>
        <div className={styles.columnType}>{schema.type}</div>
        {type.type && (
          <div className={styles.columnType2}>{formatMessage({ id: `types.${type.type}` })}</div>
        )}
        {!type.type && <div className={styles.columnType2}>未知</div>}
      </div>
    );
  };

  render() {
    const { loading } = this.props;
    const performCancel = () => {
      if (this.props.onClose) {
        this.props.onClose();
      }
    };
    const { name, error: errorMode } = this.props.component;
    const { result } = this.props.dataproInspector;
    const { success, message, data } = result;
    let table = null;
    if (success) {
      const { schema, types } = data;
      table = (
        <XDataTable
          loading={loading}
          loadingText={message}
          data={data.data || []}
          schema={schema || []}
          types={types || []}
          selectedHeaders={[]}
          errorMode={errorMode}
        />
      );
    }

    // title of the modal.
    const title = (
      <div>
        {errorMode ? '错误数据预览' : `数据预览`}
        :[
        {name}]
        {!errorMode && (
          <Button
            style={{ marginRight: '20px', float: 'right' }}
            type="primary"
            onClick={() => {
              this.props.dispatch({
                type: 'dataproPipeline/updateSavingDataset',
                payload: {
                  dataset: this.props.component,
                },
              });
            }}
          >
            <Icon type="save" />
            存储为...
          </Button>
        )}
      </div>
    );

    return (
      <Modal
        title={title}
        visible={this.props.visible}
        closable
        destroyOnClose
        onCancel={performCancel}
        width={1000}
        footer={null}
      >
        <div className={styles.tableWrapper}>
          {loading ? (
            <Spin className={styles.notTable} />
          ) : success ? (
            table
          ) : (
            <span className={styles.notTable} style={{ display: 'inline-block', color: 'red' }}>
              {message}
            </span>
          )}
        </div>
      </Modal>
    );
  }
}

export default connect(({ dataproInspector, loading }) => ({
  dataproInspector,
  loading: loading.models.dataproInspector,
}))(DataInspector);
