import React from 'react';
import { Modal, Button, Icon, Table, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './DataInspector.less';

class SchemaInspector extends React.Component {
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
      type: 'dataproInspector/inspectSchema',
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
    const { schema: fetchSchema } = this.props.dataproInspector;
    const { success, message, data } = fetchSchema;
    let table = null;
    if (success) {
      const { schema } = data;
      table = (
        <Table
          className={styles.table}
          rowKey={(r, i) => i}
          style={{ marginTop: '10px' }}
          columns={
            schema && [
              { width: 100, title: '列名', key: 'name', dataIndex: 'name' },
              { width: 100, title: '类型', key: 'type', dataIndex: 'type' },
              {
                width: 100,
                title: '是否可为空',
                key: 'nullable',
                dataIndex: 'nullable',
                render: (text, record, index) => (text ? '是' : '否'),
              },
            ]
          }
          dataSource={data.schema || []}
          scroll={{ x: schema && schema.length * 100, y: 400 }}
          pagination={false}
          loading={loading}
          bordered
          size="small"
        />
      );
    }

    // title of the modal.
    const title = (
      <div>
        表模式:[
        {name}]
        {/* <Button
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
        </Button> */}
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
}))(SchemaInspector);
