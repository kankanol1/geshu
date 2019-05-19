import React, { PureComponent, Fragment } from 'react';
import { List, Pagination, Spin } from 'antd';

import styles from './index.less';

class CardTable extends PureComponent {
  renderBody() {
    const { list, pagination, renderItem, onChange, className } = this.props;
    return (
      <Fragment>
        <div key="list" className={className}>
          {(list || []).map(item => renderItem(item))}
        </div>
        {pagination && (
          <div key="page" className={styles.paginationWrapper}>
            <Pagination
              current={pagination.current || 0}
              total={pagination.total || 0}
              pageSize={pagination.pageSize || 0}
              onChange={(current, pageSize) => {
                onChange({ current, pageSize });
              }}
            />
          </div>
        )}
      </Fragment>
    );
  }

  render() {
    const { list, loading, wrapperClassName, noData } = this.props;
    return (
      <div className={wrapperClassName}>
        <Spin spinning={loading}>
          {(list || []).length === 0 ? noData || <div>暂无数据</div> : this.renderBody()}
        </Spin>
        {/* <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={renderItem}
        />
        {loading || (
          <div className={styles.paginationWrapper}>
            <Pagination
              current={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onChange={(current, pageSize) => {
                onChange({ current, pageSize });
              }}
            />
          </div>
        )} */}
      </div>
    );
  }
}

export default CardTable;
