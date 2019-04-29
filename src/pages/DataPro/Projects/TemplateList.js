import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import CardTable from '@/components/CardTable';
import styles from './TemplateList.less';

const defaultParams = {
  pageSize: 12,
  currentPage: 1,
};

@connect(({ dataproTemplates, loading }) => ({
  dataproTemplates,
  loading: loading.models.dataproTemplates,
}))
class TemplateList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      queryParams: defaultParams,
      selected: this.props.initValue,
    };
  }

  componentDidMount() {
    this.performQuery();
  }

  performQuery() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataproTemplates/fetchTemplates',
      payload: {
        ...this.state.queryParams,
      },
    });
  }

  handleTableChange(pagination) {
    const newParams = {
      ...this.state.queryParams,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({ queryParams: newParams }, this.performQuery);
  }

  render() {
    const {
      loading,
      onChange,
      dataproTemplates: { data },
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
              if (onChange) onChange(item);
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
}

export default TemplateList;
