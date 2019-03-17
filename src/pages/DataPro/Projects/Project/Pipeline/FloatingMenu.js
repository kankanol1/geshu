import React from 'react';
import { Button, Icon } from 'antd';
import { Link } from 'dva/router';
import styles from './FloatingMenu.less';

const ButtonGroup = Button.Group;

class FloatingMenu extends React.Component {
  render() {
    const { id } = this.props;
    return (
      <div className={styles.menuWrapper}>
        <ButtonGroup>
          <Button>
            <Icon type="play-circle" /> 全部运行
          </Button>
          <Link to={`/projects/p/pipeline/${id}/publish`}>
            <Button>
              <Icon type="upload" /> 发布
            </Button>
          </Link>
        </ButtonGroup>
      </div>
    );
  }
}

export default FloatingMenu;
