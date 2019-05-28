import React from 'react';
import { Icon, Tooltip, Dropdown, Menu } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './WorkCanvas.less';

@connect(({ dataproPipeline, dataproLayoutParam }) => ({
  dataproPipeline,
  dataproLayoutParam,
}))
class LogView extends React.PureComponent {
  state = {
    show: false,
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

  renderDetail = () => {
    const { logs } = this.props.dataproPipeline;
    const menu = (
      <Menu onClick={v => this.handleFilterClicked(v)}>
        <Menu.Item key="all">全部</Menu.Item>
        <Menu.Item key="info">INFO</Menu.Item>
        <Menu.Item key="error">ERROR</Menu.Item>
      </Menu>
    );

    return (
      <React.Fragment>
        <div className={styles.logTitleWrapper}>
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
      </React.Fragment>
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
