import React, { PureComponent } from 'react';
import { List, Pagination, Spin } from 'antd';

import styles from './index.less';

class CardTable extends PureComponent {
  render() {
    const {
      list,
      pagination,
      loading,
      renderItem,
      onChange,
      className,
      wrapperClassName,
    } = this.props;
    return (
      <div className={wrapperClassName}>
        <Spin spinning={loading}>
          <div key="list" className={className}>
            {list.map(item => renderItem(item))}
          </div>
          {pagination && (
            <div key="page" className={styles.paginationWrapper}>
              <Pagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onChange={(current, pageSize) => {
                  onChange({ current, pageSize });
                }}
              />
            </div>
          )}
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
