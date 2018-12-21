import React from 'react';
import { Modal, Button, Col, Row, Select, Table, Spin } from 'antd';
import { connect } from 'dva';
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
        limit: 100,
      },
    });
  }

  render() {
    const { loading } = this.props;
    const performCancel = () => {
      if (this.props.onClose) {
        this.props.onClose();
      }
    };
    const { name } = this.props.component;
    const { result } = this.props.dataproInspector;
    const { success, message, data } = result;
    let table = null;
    if (success) {
      const { schema } = data;
      table = (
        <Table
          className={styles.table}
          style={{ marginTop: '10px' }}
          columns={
            schema &&
            schema.map(i => ({ width: 100, title: i.name, key: i.name, dataIndex: i.name }))
          }
          dataSource={data.data || []}
          scroll={{ x: schema && schema.length * 100, y: 400 }}
          pagination={false}
          loading={loading}
          bordered
          size="small"
        />
      );
    }
    return (
      <Modal
        title={`数据预览:[${name}]`}
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
