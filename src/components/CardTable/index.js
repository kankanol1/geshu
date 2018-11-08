import React, { PureComponent } from 'react';
import { List, Pagination } from 'antd';

import styles from './index.less';

class CardTable extends PureComponent {
  render() {
    const {
      data: { list, pagination },
      loading,
      renderItem,
      onChange,
    } = this.props;
    return (
      <div>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={renderItem}
        />
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
      </div>
    );
  }
}

export default CardTable;
