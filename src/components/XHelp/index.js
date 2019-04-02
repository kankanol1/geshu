import React from 'react';
import { Icon, Modal } from 'antd';
import styles from './index.less';

const XHelp = props => {
  return (
    <Icon
      type="question-circle"
      className={styles.help}
      onClick={e => {
        e.preventDefault();
        Modal.info({
          title: props.title || '帮助',
          content: (
            <div>
              <p>{props.tip}</p>
            </div>
          ),
          onOk() {},
        });
      }}
    />
  );
};

export default XHelp;
