import React from 'react';
import { Button, Spin, message, Form } from 'antd';
import router from 'umi/router';
import styles from './EditTask.less';
import { configTaskSink } from '@/services/dclient/taskAPI';
import SinkUnit from './Sink/SinkUnit';

@Form.create()
class EditTaskStepDataSink extends React.PureComponent {
  state = {
    formValues: {},
    submitting: false,
  };

  componentDidMount() {
    const { taskInfo } = this.props;
    this.state.formValues = (taskInfo && taskInfo.sinkConfigs) || {};
  }

  componentWillReceiveProps(props) {
    const { taskInfo } = props;
    this.setState({ formValues: (taskInfo && taskInfo.sinkConfigs) || {} });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { mode, id, pane, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      configTaskSink({
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
      definition: { outputs },
    } = templateInfo;

    const currentRecord = this.state.formValues;

    return (
      <React.Fragment>
        {Object.keys(outputs).map((k, i) => (
          <SinkUnit currentRecord={currentRecord[k]} key={i} id={k} info={outputs[k]} form={form} />
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
    const { mode, id, pane, templateInfo } = this.props;
    return (
      <div>
        {templateInfo && this.renderConfiguration()}
        {!templateInfo && this.renderLoading()}
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
