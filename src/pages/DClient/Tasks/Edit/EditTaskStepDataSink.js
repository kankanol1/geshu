import React from 'react';
import { Button, Radio, message, Form } from 'antd';
import router from 'umi/router';
import CSVDataSink from './Sink/CSVDataSink';
import JDBCDataSink from './Sink/JDBCDataSink';
import styles from './EditTask.less';
import { configTaskSink } from '@/services/dclient/taskAPI';

const sinks = {
  CSV: CSVDataSink,
  JDBC: JDBCDataSink,
};

const displaySinks = {
  CSV: 'CSV文件',
  JDBC: '数据库',
};

@Form.create()
class EditTaskStepDataSink extends React.PureComponent {
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
      configTaskSink({
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
    const Comp = sinks[type];
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
            {Object.keys(displaySinks).map(key => (
              <Radio.Button value={key} key={key}>
                {displaySinks[key]}
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
    const { mode, id, pane } = this.props;
    return (
      <div>
        {this.renderConfiguration()}
        <div className={styles.bottomBtns}>
          <Button
            type="primary"
            className={styles.leftBtn}
            onClick={() => router.push(`/tasks/t/${mode}/${id}/${pane - 1}`)}
          >
            &lt;上一步
          </Button>
          <Button
            type="primary"
            className={styles.rightBtn}
            loading={this.state.submitting}
            onClick={e => this.handleSubmit(e)}
          >
            下一步 &gt;
          </Button>
        </div>
      </div>
    );
  }
}

export default EditTaskStepDataSink;
