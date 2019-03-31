import React from 'react';
import { connect } from 'dva';
import { message, Row, Col, Button, Icon, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { transformationTitle, transformationDescription } from './PrepareTransformer/Utils';
import { deleteTransformation } from '@/services/datapro/pipelineAPI';
import SelectTransformation from './PrepareTransformer/SelectTransformation';
import RenameTransformation from './PrepareTransformer/RenameTransformation';
import Rename1Transformation from './PrepareTransformer/Rename1Transformation';
import Rename3Transformation from './PrepareTransformer/Rename3Transformation';
import MergeTransformation from './PrepareTransformer/MergeTransformation';

import styles from './PrepareTransformer.less';

const TransformationMapping = {
  SelectTransformation,
  RenameTransformation,
  Rename1Transformation,
  Rename3Transformation,
  MergeTransformation,
};
/*
值映射,修改列类型,增加列,列拆分,条件处理,格式化,数据提取,数学公式
*/
const transformationList = [
  { name: '列选择', value: 'SelectTransformation' },
  { name: '列重命名', value: 'RenameTransformation' },
  { name: '列重命名（前后缀）', value: 'Rename1Transformation' },
  { name: '列重命名（模式替换）', value: 'Rename3Transformation' },
  { name: '列合并', value: 'MergeTransformation' },
];

@connect(({ dataproPreviewTable, loading }) => ({
  dataproPreviewTable,
  loading: loading.models.dataproPreviewTable,
}))
class PrepareTransformer extends React.Component {
  state = {
    addingComponent: undefined,
    deleting: false,
    page: {
      size: 100,
      page: 0,
    },
    changingType: {
      x: 490,
      y: 217,
      changing: false,
      name: 'xxx',
      width: 89,
    },
  };

  // componentWillMount() {
  //   // listen click outside
  //   document.addEventListener('mousedown', this.handleGeneralClick, false);
  // }

  componentDidMount() {
    // init.
    this.refreshTable();
    // fetch all types
    this.props.dispatch({
      type: 'dataproPreviewTable/fetchTypes',
      payload: { id: this.props.id },
    });
  }

  componentWillUnmount() {
    // clear table.
    this.props.dispatch({
      type: 'dataproPreviewTable/clear',
    });
    // document.removeEventListener('mousedown', this.handleGeneralClick, false);
  }

  handleTransformationDelete = ({ value, index }) => {
    const { id, opId, configs } = this.props;
    this.setState({ deleting: true });
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
      this.setState({ deleting: false });
    });
  };

  // handleGeneralClick = (e) => {
  //   console.log('general click captured');
  //   this.setState({changingType: {}})
  // }

  refreshTable() {
    const { id, opId, configs } = this.props;
    this.props.dispatch({
      type: 'dataproPreviewTable/preview',
      payload: {
        projectId: id,
        id: opId,
        ...this.state.page,
      },
    });
  }

  showAddComponent(comp) {
    this.setState({ addingComponent: comp });
  }

  handleTypeClicked(e, name, oldType, newType) {
    // set state back.
    e.stopPropagation();
    this.setState({ changingType: {} });
    if (oldType === newType) return;
    const { dispatch, id, opId } = this.props;
    dispatch({
      type: 'dataproPreviewTable/updateType',
      payload: {
        projectId: id,
        id: opId,
        name,
        type: newType,
      },
    });
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
        configs={configs || []}
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
    const { pagination, table, loading, message: msg } = this.props.dataproPreviewTable;
    const nc = [];
    const { schema, data, types } = table;
    // set columns, etc.
    let contentRender;
    if (table && table.schema) {
      for (let i = 0; i < schema.length; i++) {
        const v = schema[i];
        nc.push({
          id: `n${i}`,
          Header: props => (
            <div>
              <span className={styles.columnName}>{v.name}</span>
              <span className={styles.columnType}> {v.type}</span>
              <span
                className={styles.columnType2}
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (this.state.changingType.changing) {
                    this.setState({
                      changingType: { x: 0, y: 0, name: undefined, changing: false },
                    });
                  } else {
                    // get target
                    const targetDOM = e.target.getBoundingClientRect();
                    const { x, y, width, height } = targetDOM;
                    this.setState({
                      changingType: {
                        y: y + height,
                        x,
                        width,
                        changing: true,
                        name: v.name,
                        type: v.type,
                      },
                    });
                  }
                }}
              >
                {types[i].type ? formatMessage({ id: `types.${types[i].type}` }) : '未知'}
              </span>
            </div>
          ),
          accessor: v.name,
          sortable: false,
        });
      }
      // render table.
      contentRender = (
        <ReactTable
          style={{ minHeight: '600px' }}
          // pages={pagination.total}
          // manual
          // onFetchData={(state, instance) => {
          //   const { id, opId, configs } = this.props;
          //   this.props.dispatch({
          //     type: 'dataproPreviewTable/fetchData',
          //     payload: {
          //       id,
          //       component: opId,
          //       ...this.state.page,
          //     },
          //   });
          // }}
          loading={loading}
          loadingText={msg || '初始化预览中...'}
          data={data || []}
          columns={nc}
          previousText="上一页"
          nextText="下一页"
          noDataText="无数据"
          pageText="页"
          ofText="总页数："
          rowsText="行"
          pageJumpText="跳至"
          rowsSelectorText="每页行数"
        />
      );
    } else {
      contentRender = (
        <div style={{ height: '400px', textAlign: 'center', paddingTop: '200px' }}>
          <Spin />
        </div>
      );
    }

    const eleStyle = {
      margin: '4px',
    };

    return (
      <React.Fragment>
        <div style={{ padding: '5px' }}>
          {transformationList.map((v, index) => (
            <Button key={index} style={eleStyle} onClick={() => this.showAddComponent(v.value)}>
              {v.name}
            </Button>
          ))}
        </div>
        {contentRender}
      </React.Fragment>
    );
  };

  renderHistory = () => {
    const { configs } = this.props;
    const renderConfig = (configs || []).map((i, index) => ({ value: i, index }));
    return (
      <React.Fragment>
        <Spin spinning={this.state.deleting}>
          <div className={styles.historyTitle}>
            操作列表
            <div className={styles.historyOp}>
              <Button type="primary" onClick={() => this.refreshTable()}>
                <Icon type="sync" />
                刷新
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
        </Spin>
      </React.Fragment>
    );
  };

  renderType = () => {
    const { types } = this.props.dataproPreviewTable;
    const { changingType } = this.state;
    const { x, y, width, type, name, changing } = changingType;
    if (!changing) return null;
    return (
      <div
        className={styles.typeDialog}
        style={{ top: y, left: x, width }}
        onBlur={() => this.setState({ changingType: {} })}
      >
        {types.map((t, i) => (
          <div
            key={i}
            className={`${styles.typeItem} ${t === type && styles.typeItemSelected}`}
            onClick={e => this.handleTypeClicked(e, name, type, t)}
          >
            {formatMessage({ id: `types.${t}` })}
          </div>
        ))}
        <div
          className={`${styles.typeItem} ${!type && styles.typeItemSelected}`}
          onClick={e => this.handleTypeClicked(e, name, type, null)}
        >
          未知
        </div>
      </div>
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
        {this.renderType()}
      </React.Fragment>
    );
  }
}

export default PrepareTransformer;
