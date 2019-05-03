import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

const renderRow = (row, schema) => {
  if (row) {
    const text = row.value;
    if (text !== null && text !== undefined) {
      if (schema.type === 'TIMESTAMP') {
        return <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss SSS')}</span>;
      } else {
        return <span>{`${text}`}</span>;
      }
    } else {
      return <span className={styles.null}>NULL</span>;
    }
  }
};

export default class XDataTable extends React.Component {
  render() {
    const {
      loading,
      loadingText: msg,
      data,
      schema,
      types,
      selectedHeaders,
      errorMode,
    } = this.props;
    const { onHeaderContextMenu, onHeaderClick, onTypeClick } = this.props;
    const nc = [];
    for (let i = 0; i < schema.length; i++) {
      const v = schema[i];
      if (['___id___', '___status___'].includes(v.name)) continue; // eslint-disable-line
      if (v.name === '___message___') {
        if (errorMode) {
          nc.push({
            id: `n${i}`,
            Header: (
              <div>
                <span className={styles.columnDummy}>&nbsp;</span>
                <span className={styles.columnError}>错误信息</span>
              </div>
            ),
            Cell: row => renderRow(row, v),
            accessor: v.name,
            sortable: false,
          });
        }
        continue; //eslint-disable-line
      }
      nc.push({
        id: `n${i}`,
        Header: (
          <div
            onContextMenu={e => {
              if (onHeaderContextMenu) onHeaderContextMenu(e, v);
            }}
            onClick={e => {
              if (onHeaderClick) onHeaderClick(e, v);
            }}
            className={`${styles.headerWrapper} ${selectedHeaders.includes(v.name) &&
              styles.selected}`}
          >
            <span className={styles.columnName}>{v.name}</span>
            <span className={styles.columnType}> {v.type}</span>
            <span
              className={styles.columnType2}
              onClick={e => {
                if (onTypeClick) onTypeClick(e, v);
              }}
            >
              {types[i].type ? formatMessage({ id: `types.${types[i].type}` }) : '未知'}
              {
                // show arrows only when clickable.
              }
              {onTypeClick && `&nbsp;&#x25BC;`}
            </span>
          </div>
        ),
        Cell: row => renderRow(row, v),
        accessor: v.name,
        sortable: false,
      });
    }
    return (
      <ReactTable
        className={styles.table}
        style={{ minHeight: '600px' }}
        // pages={pagination.total}
        // manual
        // onFetchData={(state, instance) => {
        //   const { id, opId, configs } = this.props;
        //   this.props.dispatch({
        //     type: 'dataproPreviewTable/fetchData',
        //     payload: {
        //       id,
        //       component: opId,
        //       ...this.state.page,
        //     },
        //   });
        // }}
        loading={loading}
        loadingText={msg || '初始化预览中...'}
        data={data || []}
        columns={nc}
        previousText="上一页"
        nextText="下一页"
        noDataText="无数据"
        pageText="页"
        ofText="总页数："
        rowsText="行"
        pageJumpText="跳至"
        rowsSelectorText="每页行数"
        getTrProps={(state, rowInfo, column) => {
          if (errorMode && rowInfo.original.___message___) {
            return {
              className: styles.trRed,
            };
          }
          return {};
        }}
      />
    );
  }
}
