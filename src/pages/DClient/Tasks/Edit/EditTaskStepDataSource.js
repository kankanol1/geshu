import React from 'react';
import { Form, Button, Radio, message } from 'antd';
import router from 'umi/router';
import CSVDataSource from './Source/CSVDataSource';
import JDBCDataSource from './Source/JDBCDataSource';
import styles from './EditTask.less';
import { configTaskSource } from '@/services/dclient/taskAPI';

const sources = {
  CSV: CSVDataSource,
  JDBC: JDBCDataSource,
};

const displaySources = {
  CSV: 'CSV文件',
  JDBC: '数据库',
};

@Form.create()
class EditTaskStepDataSource extends React.PureComponent {
  state = {
    type: 'CSV',
    formValues: {},
    submitting: false,
  };

  handleSubmit(e) {
    e.preventDefault();
    const { mode, id, pane, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      configTaskSource({
        id,
        type: this.state.type,
        ...fieldsValue,
      }).then(response => {
        if (response && response.success) {
          router.push(`/tasks/t/${mode}/${id}/${pane + 1}`);
        } else {
          message.error(response.message || '保存失败，请重试');
        }
      });
    });
  }

  renderConfiguration = () => {
    const { type } = this.state;
    const Comp = sources[type];
    const { form } = this.props;
    const errors = {};

    const formItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const currentRecord = this.state.formValues;

    return (
      <React.Fragment>
        <div className={`${styles.middleWrapper} ${styles.switchWrapper}`}>
          <Radio.Group value={type} onChange={v => this.setState({ type: v.target.value })}>
            {Object.keys(displaySources).map(key => (
              <Radio.Button value={key} key={key}>
                {displaySources[key]}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <Comp
          errors={errors}
          form={form}
          currentRecord={currentRecord}
          formItemProps={formItemProps}
        />
      </React.Fragment>
    );
  };

  render() {
    const { submitting } = this.state;
    return (
      <div>
        {this.renderConfiguration()}
        <div className={styles.bottomBtns}>
          <Button
            className={styles.rightBtn}
            type="primary"
            loading={submitting}
            onClick={e => this.handleSubmit(e)}
          >
            下一步 &gt;
          </Button>
        </div>
      </div>
    );
  }
}

export default EditTaskStepDataSource;
