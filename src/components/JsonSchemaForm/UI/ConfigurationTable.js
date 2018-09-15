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
  }

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
    return (v) => {
      const newData = this.state.data.map(
        (item, i) => {
          if (i === index) {
            return { ...item, [key]: v };
          } else {
            return item;
          }
        }
      );
      this.notifyChange(newData);
    };
  }

  notifyChange(newData) {
    this.setState({ data: newData });
    if (this.props.onChange) {
      this.props.onChange(newData);
    }
  }

  handleAllItemsCheckedStatus(nameKey, checked) {
    const newData = this.state.data.map(
      (item, i) => {
        const obj = { ...item };
        obj[nameKey] = checked;
        return obj;
      }
    );
    this.notifyChange(newData);
  }

  handleItemDelete(item, index) {
    this.notifyChange(this.state.data.filter((_, i) => i !== index));
  }

  handleNewItem() {
    const obj = {};
    this.props.columns.forEach((v) => { obj[v.name] = undefined; });
    this.notifyChange([...this.state.data, obj]);
  }

  renderItem = (item, index, showExtraOp) => {
    const { columns, opSpan } = this.props;
    return (
      <Row key={index} className={styles.contentRow} >
        {columns.map(
            (c, i) => (
              <Col span={c.span} key={i}>
                { c.render(item[c.name], item, this.onChange(item, index, c.name)) }
              </Col>
            )
          )
        }
        {
          showExtraOp ?
            (
              <Col span={opSpan}>
                <Button type="danger" size="small" className={styles.contentButton} onClick={() => this.handleItemDelete(item, index)} >
                  <Icon type="close" />
                </Button>
              </Col>
          )
        :
        null
        }
      </Row>
    );
  }

  render() {
    const { canAdd, maxHeight, canDelete, columns, opSpan } = this.props;
    const { data } = this.state;
    return (
      <div className={styles.tableWidget}>
        <span >
          {/* {description === undefined ? (title === undefined ? name : title) : description} */}
        </span>
        <div >
          <div className={styles.tableHeader} >
            <Row>
              {columns.map(
                (item, i) => {
                  if (item.type === 'checkbox') {
                    return (
                      <Col span={item.span} key={i}>
                        <div className={styles.header}>
                          <Button type="primary" size="small" onClick={() => this.handleAllItemsCheckedStatus(item.name, true)} >
                            全选
                          </Button>
                          &nbsp;
                          <Button type="primary" size="small" onClick={() => this.handleAllItemsCheckedStatus(item.name, false)} >
                            全不选
                          </Button>
                        </div>
                      </Col>
                    );
                  }
                  return (
                    <Col span={item.span} key={i}>
                      <div className={styles.header}>{item.title}</div>
                    </Col>
                  );
                }
              )}
              <Col span={opSpan}>
                {
                canAdd ?
                  (
                    <Button size="small" type="primary" onClick={() => this.handleNewItem()}>
                      <Icon type="plus" />
                    </Button>
                  )
                :
                null
              }
              </Col>
            </Row>
          </div>
          <Scrollbars autoHeight autoHeightMin={0} autoHeightMax={maxHeight} >
            <div className={styles.tableContent} >
              {data.map(
                (item, k) => this.renderItem(item, k, canDelete)
              )}
            </div>
          </Scrollbars>
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
