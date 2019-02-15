import React from 'react';
import { Form, Button, Radio, message } from 'antd';
import router from 'umi/router';
import styles from './EditTask.less';

class EditTaskStepChooseTemplate extends React.PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { mode, id, pane } = this.props;
    router.push(`/tasks/t/${mode}/${id}/${pane + 1}`);
  };

  renderTemplates = list => {
    return (
      <div className={styles.templateWrapper}>
        {list.map((i, index) => (
          <div className={styles.templateItem} key={index}>
            <div className={styles.templateTitle}>{i.name}</div>
            <div className={styles.templateDesc}>{i.description}</div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const list = [
      {
        name: '模版1',
        description: '描述1',
      },
      {
        name: '模版1',
        description: '描述1',
      },
      {
        name: '模版1',
        description: '描述1',
      },
      {
        name: '模版1',
        description: '描述1',
      },
      {
        name: '模版1',
        description: '描述1',
      },
      {
        name: '模版1',
        description: '描述1',
      },
      {
        name: '模版1',
        description: '描述1',
      },
      {
        name: '模版1',
        description: '描述1',
      },
    ];
    return (
      <React.Fragment>
        {this.renderTemplates(list)}

        <div className={styles.bottomBtns}>
          <Button
            className={styles.rightBtn}
            type="primary"
            loading={false}
            onClick={e => this.handleSubmit(e)}
          >
            下一步 &gt;
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default EditTaskStepChooseTemplate;
