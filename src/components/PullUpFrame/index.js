import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormItem } from 'antd';
import { routerRedux } from 'dva/router';
import classNames from 'classnames';
import styles from './index.css';
import GojsRelationGraph from '../../utils/GojsRelationGraph';
// eslint-disable-line
class PullUpFrame extends Component {
  static propTypes = {
    className: PropTypes.string,
    tagClick: PropTypes.func,
  };
  static defaultProps = {
    className: '',
    tagClick: () => {},
  };
  state = {
    showCode: true,
  };
  onSwitch = () => {
    const { showCode } = this.state;
    this.setState({
      showCode: !showCode,
    });
    this.props.tagClick(!showCode);
    const { diagram } = GojsRelationGraph.getGraph('graph_query');
    diagram.scale = Math.random();
  }
  render() {
    const { children, className } = this.props;
    const { showCode } = this.state;
    return (
      showCode ?
        (
          <div className={classNames(className, styles.content)}>
            {children}
            <div className={styles.arrowBottom}>
              <i className={styles.arrowUp} onClick={this.onSwitch} />
            </div>
          </div>
        ) : (
          <div onClick={this.onSwitch} className={styles.contentHide}>
            <i className={styles.arrowDown} onClick={this.onSwitch} />
          </div>
        )

    );
  }
}

export default PullUpFrame;
