import React from 'react';
import { Form, Button, Radio, message, Spin, Row, Col } from 'antd';
import router from 'umi/router';
import SourceUnit from './Source/SourceUnit';
import styles from './EditTask.less';
import { configTaskSource } from '@/services/dclient/taskAPI';

@Form.create()
class EditTaskStepDataSource extends React.PureComponent {
  state = {
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
        configs: fieldsValue,
      }).then(response => {
        if (response && response.success) {
          router.push(`/tasks/t/${mode}/${id}/${pane + 1}`);
        } else {
          message.error((response && response.message) || '保存失败，请重试');
        }
      });
    });
  }

  renderConfiguration = () => {
    const { form, templateInfo } = this.props;
    const {
      definition: { inputs },
    } = templateInfo;

    const currentRecord = this.state.formValues;

    return (
      <React.Fragment>
        {Object.keys(inputs).map((k, i) => (
          <SourceUnit
            currentRecord={currentRecord[k] || {}}
            key={i}
            id={k}
            info={inputs[k]}
            form={form}
          />
        ))}
      </React.Fragment>
    );
  };

  renderLoading = () => {
    return (
      <div>
        <Spin />
      </div>
    );
  };

  render() {
    const { submitting } = this.state;
    const { templateInfo } = this.props;
    return (
      <div>
        {templateInfo && this.renderConfiguration()}
        {!templateInfo && this.renderLoading()}
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
