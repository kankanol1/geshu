import React from 'react';
import { Icon, Tooltip } from 'antd';
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

  renderDetail = () => {
    const { logs } = this.props.dataproPipeline;
    return (
      <React.Fragment>
        <div className={styles.logTitleWrapper}>
          <span className={styles.logTitle}>输出日志</span>
          <div className={styles.logOps}>
            <Tooltip title="过滤日志">
              <Icon type="filter" />
            </Tooltip>
            <Tooltip title="清空">
              <Icon type="stop" />
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
              className={`${show ? 'active' : ''}`}
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
