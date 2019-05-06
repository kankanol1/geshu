import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { message, Row, Col, Button, Icon, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import key from 'keymaster';
import { transformationTitle, transformationDescription } from './PrepareTransformer/Utils';
import { deleteTransformation } from '@/services/datapro/pipelineAPI';
import SelectTransformation from './PrepareTransformer/SelectTransformation';
import RenameTransformation from './PrepareTransformer/RenameTransformation';
import Rename1Transformation from './PrepareTransformer/Rename1Transformation';
import Rename3Transformation from './PrepareTransformer/Rename3Transformation';
import ConcatTransformation from './PrepareTransformer/ConcatTransformation';

import styles from './PrepareTransformer.less';
import XDataTable from '@/components/XDataTable';

const hasError = (index, err) => {
  return index < err.length && Object.keys(err[index]).length > 0;
};

const TransformationMapping = {
  SelectTransformation,
  RenameTransformation,
  Rename1Transformation,
  Rename3Transformation,
  ConcatTransformation,
};
/*
值映射,修改列类型,增加列,列拆分,条件处理,格式化,数据提取,数学公式
*/
const transformationList = [
  { name: '列选择', value: 'SelectTransformation' },
  { name: '列重命名', value: 'RenameTransformation' },
  // { name: '列重命名（前后缀）', value: 'Rename1Transformation' },
  // { name: '列重命名（模式替换）', value: 'Rename3Transformation' },
  { name: '列合并', value: 'ConcatTransformation' },
];

const singleColumnMenus = [
  {
    name: '保留此列',
    value: 'SelectTransformation',
    props: (selected, tableSchema) => ({ columns: selected }),
  },
  {
    name: '保留其余列',
    value: 'SelectTransformation',
    props: (selected, tableSchema) => ({
      columns: tableSchema.map(i => i.name).filter(i => !selected.includes(i)),
    }),
  },
  {
    name: '列重命名',
    value: 'RenameTransformation',
    props: (selected, tableSchema) => ({ columns: selected }),
  },
];

const multipleColumnMenus = [
  {
    name: '保留选中列',
    value: 'SelectTransformation',
    props: (selected, tableSchema) => ({ columns: selected }),
  },
  {
    name: '保留其余列',
    value: 'SelectTransformation',
    props: (selected, tableSchema) => ({
      columns: tableSchema.map(i => i.name).filter(i => !selected.includes(i)),
    }),
  },
  {
    name: '列重命名',
    value: 'RenameTransformation',
    props: (selected, tableSchema) => ({ columns: selected }),
  },
  {
    name: '列合并',
    value: 'ConcatTransformation',
    props: (selected, tableSchema) => ({ columns: selected }),
  },
];

@connect(({ dataproPreviewTable, loading }) => ({
  dataproPreviewTable,
  loading: loading.models.dataproPreviewTable,
}))
class PrepareTransformer extends React.Component {
  state = {
    addingComponent: undefined,
    componentProps: {},
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
    selectedHeaders: [],
    contextMenu: {
      x: 470,
      y: 220,
      showing: false,
    },
    historyHeight: 0,
  };

  table = React.createRef();

  typeDialog = React.createRef(); // for type div.

  contextMenu = React.createRef(); // for context menu.

  errorDisplay = React.createRef(); // for error display

  componentWillMount() {
    // listen click outside
    document.addEventListener('mousedown', this.handleGeneralClick, false);
  }

  componentDidMount() {
    // init.
    this.refreshTable();
    // fetch all types
    this.props.dispatch({
      type: 'dataproPreviewTable/fetchTypes',
      payload: { id: this.props.id },
    });
  }

  componentDidUpdate() {
    if (this.table.current) {
      const tableDom = ReactDOM.findDOMNode(this.table.current).getBoundingClientRect();
      const { height } = tableDom;
      if (height !== this.state.historyHeight) {
        this.setState({ historyHeight: height }); // eslint-disable-line
      }
    }
    if (this.errorDisplay.current) {
      const errorDom = ReactDOM.findDOMNode(this.errorDisplay.current).getBoundingClientRect();
      const { height } = errorDom;
      if (height !== this.state.historyHeight) {
        this.setState({ historyHeight: height }); // eslint-disable-line
      }
    }
  }

  componentWillUnmount() {
    // clear table.
    this.props.dispatch({
      type: 'dataproPreviewTable/clear',
    });
    document.removeEventListener('mousedown', this.handleGeneralClick, false);
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

  handleGeneralClick = e => {
    if (this.typeDialog.current) {
      const typeDialog = ReactDOM.findDOMNode(this.typeDialog.current);
      if (!typeDialog.contains(e.target)) {
        this.setState({ changingType: { changing: false } });
      }
    }
    if (this.contextMenu.current) {
      const contextMenu = ReactDOM.findDOMNode(this.contextMenu.current);
      if (!contextMenu.contains(e.target)) {
        this.setState({ contextMenu: { showing: false } });
      }
    }
  };

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

  handleHeaderClick(e, name) {
    e.stopPropagation();
    // 17: ctrl on windows, linux
    // 91: command on Mac
    if (key.isPressed(17) || key.isPressed(91)) {
      let newSelected = this.state.selectedHeaders.filter(i => i !== name);
      if (newSelected.length === this.state.selectedHeaders.length) {
        newSelected = [...this.state.selectedHeaders, name];
      }
      this.setState({ selectedHeaders: newSelected });
    } else if (this.state.selectedHeaders.length === 1 && this.state.selectedHeaders[0] === name) {
      // unselect.
      this.setState({ selectedHeaders: [] });
    } else {
      this.setState({ selectedHeaders: [name] });
    }
  }

  handleHeaderRightClick(e, name) {
    e.preventDefault();
    e.stopPropagation();
    const { selectedHeaders } = this.state;
    if (selectedHeaders.includes(name)) {
      this.setState({ contextMenu: { x: e.pageX, y: e.pageY, showing: true } });
    } else {
      // change to new selected one.
      this.setState({
        contextMenu: { x: e.pageX, y: e.pageY, showing: true },
        selectedHeaders: [name],
      });
    }
  }

  handleTypeTitleClick(e, v) {
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
  }

  renderTransformationComponent() {
    const { addingComponent, componentProps } = this.state;
    if (!addingComponent) return;
    const Comp = TransformationMapping[addingComponent];
    const { id, opId, configs } = this.props;
    return (
      <Comp
        id={id}
        opId={opId}
        configs={configs || []}
        {...componentProps}
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

  renderModifyingComponent() {
    const { modifyingComponent } = this.state;
    if (!modifyingComponent) return;
    const { type, config, index } = modifyingComponent;
    const Comp = TransformationMapping[type];
    const { id, opId, configs } = this.props;
    return (
      <Comp
        id={id}
        index={index}
        opId={opId}
        configs={config}
        onCancel={() => {
          this.setState({ modifyingComponent: undefined });
        }}
        onOk={() => {
          this.setState({ modifyingComponent: undefined });
          // refresh configs.
          this.props.refresh();
        }}
      />
    );
  }

  renderContextMenu = () => {
    const { selectedHeaders, contextMenu } = this.state;
    const { y, x, showing } = contextMenu;
    if (!showing) return null;
    const list = selectedHeaders.length === 1 ? singleColumnMenus : multipleColumnMenus;
    return (
      <div className={styles.contextMenu} style={{ top: y, left: x }} ref={this.contextMenu}>
        {list.map((l, i) => (
          <div
            key={i}
            className={styles.menuItem}
            onClick={() =>
              this.setState({
                contextMenu: { showing: false, y: 0, x: 0 },
                addingComponent: l.value,
                componentProps: l.props(
                  selectedHeaders,
                  this.props.dataproPreviewTable.table.schema
                ), // selected names
              })
            }
          >
            {l.name}
          </div>
        ))}
      </div>
    );
  };

  renderTable = () => {
    const { pagination, table, loading, message: msg } = this.props.dataproPreviewTable;
    const { schema, data, types } = table;
    const { selectedHeaders } = this.state;
    // set columns, etc.
    let contentRender;
    if (table && table.schema) {
      // render table.
      contentRender = (
        <XDataTable
          ref={this.table}
          loading={loading}
          loadingText={msg}
          data={data || []}
          schema={schema || []}
          types={types || []}
          selectedHeaders={selectedHeaders}
          // listeners:
          onHeaderContextMenu={(e, v) => this.handleHeaderRightClick(e, v.name)}
          onHeaderClick={(e, v) => this.handleHeaderClick(e, v.name)}
          onTypeClick={(e, v) => this.handleTypeTitleClick(e, v)}
        />
      );
    } else if (loading) {
      contentRender = (
        <div style={{ height: '400px', textAlign: 'center', paddingTop: '200px' }}>
          <Spin />
        </div>
      );
    } else {
      // error.
      contentRender = (
        <div
          ref={this.errorDisplay}
          style={{ height: '600px', textAlign: 'center', paddingTop: '300px', background: 'white' }}
        >
          <span style={{ color: 'red' }}>{msg}</span>
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
    const { configs, errors } = this.props;
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
          <div className={styles.historyList} style={{ height: `${this.state.historyHeight}px` }}>
            {renderConfig.reverse().map(item => (
              <div
                className={`${styles.historyItem} ${hasError(item.index, errors) &&
                  styles.errorItem}`}
                key={item.index}
              >
                <div className={styles.operations}>
                  <Icon
                    type="delete"
                    style={{ color: 'red' }}
                    onClick={() => this.handleTransformationDelete(item)}
                  />
                  {/* <Icon type="edit" onClick={() => this.setState({ modifyingComponent: { ...item.value, index: item.index} })} /> */}
                </div>
                <div className={styles.title}> {transformationTitle(item.value.type)}</div>
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
      <div className={styles.typeDialog} style={{ top: y, left: x, width }} ref={this.typeDialog}>
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
        {this.renderContextMenu()}
        {this.renderModifyingComponent()}
      </React.Fragment>
    );
  }
}

export default PrepareTransformer;
