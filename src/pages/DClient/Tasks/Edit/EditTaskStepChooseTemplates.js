import React from 'react';
import { connect } from 'dva';
import { Form, Button, Radio, message } from 'antd';
import router from 'umi/router';
import CardTable from '@/components/CardTable';

import { configTemplate } from '@/services/dclient/taskAPI';
import styles from './EditTask.less';

const defaultParams = {
  pageSize: 12,
  currentPage: 1,
};

@connect(({ dtemplates, loading }) => ({
  dtemplates,
  loading: loading.models.dtemplates,
}))
class EditTaskStepChooseTemplate extends React.PureComponent {
  state = {
    queryParams: defaultParams,
    selected: this.props.templateId,
    loading: false,
  };

  componentDidMount() {
    this.performQuery();
  }

  componentWillReceiveProps(props) {
    this.setState({ selected: this.state.selected || props.templateId });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { mode, id, pane } = this.props;
    const { selected } = this.state;
    this.setState({ loading: true });
    configTemplate({ id, templateId: selected }).then(response => {
      this.setState({ loading: false }, () => {
        router.push(`/tasks/t/${mode}/${id}/${pane + 1}`);
      });
    });
  };

  handleTableChange(pagination) {
    const newParams = {
      ...this.state.queryParams,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({ queryParams: newParams }, this.performQuery);
  }

  performQuery() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dtemplates/fetchAllTemplates',
      payload: this.state.queryParams,
    });
  }

  renderTemplates() {
    const {
      loading,
      dtemplates: { data },
    } = this.props;
    const { selected } = this.state;
    return (
      <CardTable
        className={styles.cardsWrapper}
        loading={loading}
        list={data.list}
        pagination={data.pagination}
        onChange={pagination => this.handleTableChange(pagination)}
        renderItem={item => (
          <div
            className={styles.cardWrapper}
            onClick={() => {
              this.setState({ selected: item.id });
            }}
            key={item.id}
          >
            <div
              className={`${styles.templateItem} ${styles.card}  ${selected &&
                selected === item.id &&
                styles.selected}`}
              key={item.id}
            >
              <div className={styles.templateTitle}>{item.name}</div>
              <div className={styles.templateDesc}>{item.description}</div>
            </div>
          </div>
        )}
      />
    );
  }

  render() {
    const { loading, selected } = this.state;
    return (
      <React.Fragment>
        {this.renderTemplates()}

        <div className={styles.bottomBtns}>
          <Button
            className={styles.rightBtn}
            type="primary"
            loading={loading}
            disabled={!selected}
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
