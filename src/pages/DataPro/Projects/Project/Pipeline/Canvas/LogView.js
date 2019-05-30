import React from 'react';
import { Icon, Tooltip, Dropdown, Menu } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { DraggableCore } from 'react-draggable';
import styles from './WorkCanvas.less';

@connect(({ dataproPipeline, dataproLayoutParam }) => ({
  dataproPipeline,
  dataproLayoutParam,
}))
class LogView extends React.PureComponent {
  state = {
    show: false,
    height: 200,
    lastHeight: 0,
    lastY: 0,
    maxHeight: 0,
  };

  handleFilterClicked = ({ key }) => {
    this.props.dispatch({
      type: 'dataproPipeline/setLogLevel',
      payload: {
        level: key,
        id: this.props.projectId,
      },
    });
  };

  handleLogClear = () => {
    this.props.dispatch({
      type: 'dataproPipeline/clearLog',
      payload: {
        id: this.props.projectId,
      },
    });
  };

  handleResize = e => {
    e.preventDefault();
    e.stopPropagation();
    const { lastHeight, lastY, maxHeight } = this.state;
    this.setState({ height: Math.min(lastHeight + lastY - e.pageY, maxHeight) });
  };

  handleResizeStart = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      lastHeight: this.state.height,
      lastY: e.pageY,
      maxHeight: document.documentElement.offsetHeight - 100,
    });
  };

  renderDetail = () => {
    const { logs } = this.props.dataproPipeline;
    const { height } = this.state;
    const menu = (
      <Menu onClick={v => this.handleFilterClicked(v)}>
        <Menu.Item key="all">全部</Menu.Item>
        <Menu.Item key="info">简略</Menu.Item>
        <Menu.Item key="error">仅错误</Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.logPaneWrapper} style={{ height: `${height}px` }}>
        <div className={styles.logTitleWrapper}>
          <DraggableCore
            onStart={e => this.handleResizeStart(e)}
            onDrag={e => this.handleResize(e)}
          >
            <div className={styles.dragger} />
          </DraggableCore>
          <span className={styles.logTitle}>输出日志</span>
          <div className={styles.logOps}>
            <Tooltip title="过滤日志">
              <Dropdown overlay={menu} trigger={['click']}>
                <Icon type="filter" />
              </Dropdown>
            </Tooltip>
            <Tooltip title="清空">
              <Icon type="stop" onClick={() => this.handleLogClear()} />
            </Tooltip>
          </div>
        </div>
        <div className={styles.logView}>
          {(logs || []).map((l, i) => (
            <div key={i}>
              <span className={styles.logTime}>{moment(l.time).format('HH:mm:DD')}</span>
              <span className={styles.logLevel}>{l.level}</span>
              <span className={styles.logMessage}>{l.message}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  render() {
    const { show } = this.state;
    const { sideMenu } = this.props.dataproLayoutParam;
    return (
      <div className={styles.logViewWrapper} style={{ paddingLeft: `${sideMenu}px` }}>
        <div className={styles.logViewToolBar}>
          <Tooltip title={show ? '隐藏日志' : '显示日志'}>
            <Icon
              // type={show ? "close-square": "code"}
              type="code"
              className={(show && 'active') || undefined}
              onClick={() => this.setState({ show: !show })}
            />
          </Tooltip>
        </div>
        {show && this.renderDetail()}
      </div>
    );
  }
}

export default LogView;
