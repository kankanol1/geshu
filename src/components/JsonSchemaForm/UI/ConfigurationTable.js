import React from 'react';
import { Input, Row, Col, Checkbox, Button, Icon, Select } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
import styles from './ConfigurationTable.less';

export default class ConfigurationTable extends React.Component {
  static defaultProps = {
    // data: [],
    // columns: [],
    // columns: [{name, title, span, render}]
    maxHeight: 400,
    canAdd: false,
    canDelete: false,
    opSpan: 2,
    onChange: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ data: props.data });
  }

  onChange(originItem, index, key) {
    return v => {
      const newData = this.state.data.map((item, i) => {
        if (i === index) {
          return { ...item, [key]: v };
        } else {
          return item;
        }
      });
      this.notifyChange(newData);
    };
  }

  notifyChange(newData) {
    const { data: oldData } = this.state;
    this.setState({ data: newData });
    if (this.props.onChange) {
      this.props.onChange(newData, oldData);
    }
  }

  handleAllItemsCheckedStatus(nameKey, checked) {
    const newData = this.state.data.map((item, i) => {
      const obj = { ...item };
      obj[nameKey] = checked;
      return obj;
    });
    this.notifyChange(newData);
  }

  handleItemDelete(item, index) {
    this.notifyChange(this.state.data.filter((_, i) => i !== index));
  }

  handleNewItem() {
    const obj = {};
    this.props.columns.forEach(v => {
      obj[v.name] = undefined;
    });
    this.notifyChange([...this.state.data, obj]);
  }

  handleOrderChange(oldIndex, newIndex) {
    const newd = this.state.data.filter((item, i) => i !== oldIndex);
    newd.splice(newIndex, 0, this.state.data[oldIndex]);
    this.notifyChange(newd);
  }

  renderItem = (item, index, totalSize, showExtraOp, orderSpan) => {
    const { columns, opSpan } = this.props;
    return (
      <Row key={index} className={styles.contentRow}>
        {columns.map((c, i) => (
          <Col span={c.span} key={i}>
            {c.render(item[c.name], item, this.onChange(item, index, c.name), index)}
          </Col>
        ))}
        {orderSpan && (
          <Col span={orderSpan} style={{ textAlign: 'center' }}>
            {index !== 0 && (
              <Icon
                size="large"
                className={styles.orderIcon}
                type="caret-up"
                onClick={e => {
                  e.preventDefault();
                  this.handleOrderChange(index, index - 1);
                }}
              />
            )}
            {index !== totalSize - 1 && (
              <Icon
                size="large"
                className={styles.orderIcon}
                type="caret-down"
                onClick={e => {
                  e.preventDefault();
                  this.handleOrderChange(index, index + 1);
                }}
              />
            )}
          </Col>
        )}
        {showExtraOp && (
          <Col span={opSpan} style={{ textAlign: 'center' }}>
            <Button
              type="danger"
              size="small"
              className={styles.contentButton}
              onClick={() => this.handleItemDelete(item, index)}
            >
              <Icon type="close" />
            </Button>
          </Col>
        )}
      </Row>
    );
  };

  renderCheckboxHeader = (item, key, data) => {
    const checkedNum = data.filter(it => it[item.name]).length;
    return (
      <Col span={item.span} key={key}>
        <div className={styles.header}>
          <Checkbox
            indeterminate={checkedNum > 0 && checkedNum < data.length}
            checked={checkedNum === data.length}
            className={styles.checkbox}
            onChange={v => this.handleAllItemsCheckedStatus(item.name, v.target.checked)}
          />
          {item.title}
        </div>
      </Col>
    );
  };

  render() {
    const { canAdd, maxHeight, canDelete, columns, opSpan, orderSpan } = this.props;
    const { data } = this.state;
    return (
      <div className={styles.tableWidget}>
        <span>
          {/* {description === undefined ? (title === undefined ? name : title) : description} */}
        </span>
        <div>
          <div className={styles.tableHeader}>
            <Row>
              {columns.map((item, i) => {
                if (item.type === 'checkbox') {
                  return this.renderCheckboxHeader(item, i, data);
                }
                return (
                  <Col span={item.span} key={i}>
                    <div className={styles.header}>{item.title}</div>
                  </Col>
                );
              })}
              <Col span={orderSpan} />
              <Col span={opSpan}>
                {canAdd && (
                  <Button size="small" type="primary" onClick={() => this.handleNewItem()}>
                    <Icon type="plus" />
                  </Button>
                )}
              </Col>
            </Row>
          </div>
          {/* <Scrollbars autoHeight autoHeightMin={0} autoHeightMax={maxHeight}> */}
          <div className={styles.tableContent}>
            {data.map((item, k) => this.renderItem(item, k, data.length, canDelete, orderSpan))}
          </div>
          {/* </Scrollbars> */}
        </div>
      </div>
    );
  }
}

ConfigurationTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  canAdd: PropTypes.bool,
  canDelete: PropTypes.bool,
  maxHeight: PropTypes.number,
  opSpan: PropTypes.number,
  onChange: PropTypes.func,
};
