
import React from 'react';
import { Input, Row, Col, Checkbox, Button, Icon, Select } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './DefineSchemaWidget.less';

const { Option } = Select;

export default class DefineSchemaWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    const { formData } = this.props;
    this.state = {
      data: formData === undefined ? [] : formData,
    };
  }
  componentWillReceiveProps(props) {
    const { formData } = props;
    this.setState({
      data: formData === undefined ? [] : formData,
    });
  }

  onChange(originItem, index, key, v) {
    const value = (typeof (v) === 'object') ?
      (v.target.type === 'checkbox' ? v.target.checked : v.target.value)
      : v;
    const newData = this.state.data.map(
      (item, i) => {
        if (i === index) {
          return Object.assign({}, { ...item, [key]: value });
        } else {
          return item;
        }
      }
    );
    this.setState({
      data: Object.assign([], newData),
    }, () => this.props.onChange(newData));
  }

  handleItemDelete(item, index) {
    this.setState({
      data: this.state.data.filter((_, i) => i !== index),
    }, () => this.props.onChange(this.state.data));
  }

  handleNewItem() {
    this.setState({
      data: Object.assign([], [...this.state.data,
        { name: undefined, type: undefined, nullable: false }]),
    }, () => this.props.onChange(this.state.data));
  }

  renderItem = (item, index) => {
    return (
      <Row key={index} className={styles.contentRow} >
        <Col span={6}>
          <div style={{ textAlign: 'center' }}>
            <Checkbox onChange={v => this.onChange(item, index, 'nullable', v)} checked={item.nullable} />
          </div>
        </Col>
        <Col span={8}>
          <Input defaultValue={item.name} value={item.name} onChange={v => this.onChange(item, index, 'name', v)} />
        </Col>
        <Col span={8}>
          {/* <Input value={item.type} onChange={v => this.onChange(item, index, 'type', v)} />  */}
          <Select style={{ width: 120 }} onChange={v => this.onChange(item, index, 'type', v)} defaultValue={item.type} value={item.type} >
            <Option value="String">String</Option>
            <Option value="Int">Int</Option>
            <Option value="Float">Float</Option>
          </Select>
        </Col>
        <Col span={2}>
          <Button type="danger" size="small" className={styles.contentButton} onClick={() => this.handleItemDelete(item, index)} >
            <Icon type="close" />
          </Button>
        </Col>
      </Row>
    );
  }


  render() {
    const maxHeight = this.props.height || 200;
    return (
      <div className={styles.tableWidget}>
        <span >
          {/* {description === undefined ? (title === undefined ? name : title) : description} */}
        </span>
        <div >
          <div className={styles.tableHeader} >
            <Row>
              <Col span={6}><div className={styles.header}>可为null</div></Col>
              <Col span={8}><div className={styles.header}>列名</div></Col>
              <Col span={8}><div className={styles.header}>类型</div></Col>
              <Col span={2}>
                <Button size="small" type="primary" onClick={() => this.handleNewItem()}>
                  <Icon type="plus" />
                </Button>
              </Col>
            </Row>
          </div>
          <Scrollbars autoHeight autoHeightMin={0} autoHeightMax={maxHeight} >
            <div className={styles.tableContent} >
              {this.state.data.map(
                (item, k) => this.renderItem(item, k)
              )}
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}
