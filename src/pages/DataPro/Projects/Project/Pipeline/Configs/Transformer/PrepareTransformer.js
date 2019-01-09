import React from 'react';
import { connect } from 'dva';
import { message, Row, Col, Button, Icon } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { transformationTitle, transformationDescription } from './PrepareTransformer/Utils';
import SelectTransformation from './PrepareTransformer/SelectTransformation';
import RenameTransformation from './PrepareTransformer/RenameTransformation';
import { deleteTransformation } from '@/services/datapro/pipelineAPI';

import styles from './PrepareTransformer.less';

const TransformationMapping = {
  SelectTransformation,
  RenameTransformation,
};

@connect(({ dataproPreviewTable, loading }) => ({
  dataproPreviewTable,
  loading: loading.models.dataproPreviewTable,
}))
class PrepareTransformer extends React.Component {
  state = {
    addingComponent: undefined,
    page: {
      size: 100,
      page: 0,
    },
  };

  componentDidMount() {
    // init.
    const { id, opId, configs } = this.props;
    this.props.dispatch({
      type: 'dataproPreviewTable/preview',
      payload: {
        id,
        component: opId,
        ...this.state.page,
      },
    });
  }

  handleTransformationDelete = ({ value, index }) => {
    const { id, opId, configs } = this.props;
    deleteTransformation({
      projectId: id,
      id: opId,
      index,
    }).then(response => {
      if (response) {
        if (response.success) {
          // do nothing.
        } else {
          message.error('删除出错');
        }
      }
      this.props.refresh();
    });
  };

  showAddComponent(comp) {
    this.setState({ addingComponent: comp });
  }

  renderTransformationComponent() {
    const { addingComponent } = this.state;
    if (!addingComponent) return;
    const Comp = TransformationMapping[addingComponent];
    const { id, opId, configs } = this.props;
    return (
      <Comp
        id={id}
        opId={opId}
        configs={configs}
        onCancel={() => {
          this.setState({ addingComponent: undefined });
        }}
        onOk={() => {
          this.setState({ addingComponent: undefined });
          // refresh configs.
          this.props.refresh();
        }}
      />
    );
  }

  renderTable = () => {
    const { result } = this.props.dataproPreviewTable;
    const { success, message: msg, data: table } = result;
    const nc = [];
    if (table) {
      const { schema, data } = table;
      for (let i = 0; i < schema.length; i++) {
        const v = schema[i];
        nc.push({
          id: v.name,
          Header: props => (
            <div>
              <span style={{ color: 'black', display: 'block', fontWeight: '500' }}>{v.name}</span>
              <span style={{ display: 'block', fontSize: '12px' }}> {v.type}</span>
              {/* <span style={{ display: 'block', fontSize: '12px', color: '#1abc9c' }}>
                {secondTypes[i]}
              </span> */}
            </div>
          ),
          accessor: v.name,
          sortable: false,
        });
      }
      const eleStyle = {
        margin: '4px',
      };

      return (
        <React.Fragment>
          <div style={{ padding: '5px' }}>
            {/* <Button style={eleStyle}>列重命名</Button>
            <Button style={eleStyle}>值映射</Button>
            <Button style={eleStyle}>合并列</Button>
            <Button style={eleStyle}>修改列类型</Button>
            <Button style={eleStyle}>增加列</Button>
            <Button style={eleStyle}>列拆分</Button>
            <Button style={eleStyle}>条件处理</Button>
            <Button style={eleStyle}>格式化</Button>
            <Button style={eleStyle}>数据提取</Button>
            <Button style={eleStyle}>数学公式</Button> */}
            <Button style={eleStyle} onClick={() => this.showAddComponent('SelectTransformation')}>
              列选择
            </Button>
            <Button style={eleStyle} onClick={() => this.showAddComponent('RenameTransformation')}>
              列重命名
            </Button>
          </div>
          <ReactTable data={data} columns={nc} />
        </React.Fragment>
      );
    } else {
      // TODO error handling etc.
      return <div>loading...</div>;
    }
  };

  renderHistory = () => {
    const { configs } = this.props;
    const renderConfig = configs.map((i, index) => ({ value: i, index }));
    return (
      <React.Fragment>
        <div className={styles.historyTitle}>
          操作列表
          <div className={styles.historyOp}>
            <Button type="primary">
              <Icon type="caret-right" />
              运行
            </Button>
          </div>
        </div>
        <div className={styles.historyList}>
          {renderConfig.reverse().map(item => (
            <div className={styles.historyItem} key={item.index}>
              <div className={styles.operations}>
                <Icon
                  type="delete"
                  style={{ color: 'red' }}
                  onClick={() => this.handleTransformationDelete(item)}
                />
                {/* <Icon type="edit" /> */}
              </div>
              <div className={styles.title}>{transformationTitle(item.value.type)}</div>
              <span className={styles.description}>
                {transformationDescription(item.value.type, item.value.config)}
              </span>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col span={6}>{this.renderHistory()}</Col>
          <Col span={18}>{this.renderTable()}</Col>
        </Row>
        {this.renderTransformationComponent()}
      </React.Fragment>
    );
  }
}

export default PrepareTransformer;
