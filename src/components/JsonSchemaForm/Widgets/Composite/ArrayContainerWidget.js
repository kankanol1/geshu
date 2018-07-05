import React from 'react';
import { Row, Col, Input, Button, Icon, Card } from 'antd';
import styles from './ArrayContainerWidget.less';

const ButtonGroup = Button.Group;

export default class ArrayContainerWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      components: [],
    };
  }

  onReorderClick= (oldIndex, newIndex) => {
    // TODO.
  }

  onDropIndexClick(index) {
    this.setState({ components: this.state.components.filter((item, i) => i !== index) });
  }

  createNewItem() {
    const { uiSchema, schema, required, item } = this.props;
    const { components } = this.state;
    const newItem = React.cloneElement(item,
      { key: components.length, uiSchema, schema, required });
    this.setState({ components: [newItem, ...components] });
  }


  renderItem = (item, index, ordered = false) => {
    let extraBtn = null;
    if (ordered) {
      extraBtn = (
        <React.Fragment>
          <Button
            onClick={() => this.onReorderClick(
                index,
                index - 1
              )}
            disabled={index === 0}
            className="slim-btn"
          >
            <Icon type="up" />
          </Button>
          <Button
            onClick={() => this.onReorderClick(
                index,
                index + 1
              )}
            className="slim-btn"
            disabled={index === this.state.components.length - 1}
          >
            <Icon type="down" />
          </Button>
        </React.Fragment>
      );
    }
    return (
      <div key={index} className={styles.itemContainer}>
        <Row className="arr-row">
          <Col span={ordered ? 18 : 22} className={styles.item}>{item}</Col>
          <Col span={ordered ? 6 : 2} className={styles.btn}>
            <ButtonGroup>
              {extraBtn}
              <Button onClick={() => this.onDropIndexClick(index)} className="slim-btn" type="danger">
                <Icon type="close" />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { uiSchema, schema, required, canAdd } = this.props;
    const { description, title } = schema;
    return (
      <div>
        <Row style={{ height: '36px' }}>
          <Col span={20}><span style={{ lineHeight: '36px' }}>{description === undefined ? title : description}</span> { required ? '*' : null } </Col>
          {canAdd && (
          <Col span={4}>
            <Button onClick={() => this.createNewItem()} type="primary">
              <Icon type="plus" />
            </Button>
          </Col>
      )}
        </Row>
        { this.state.components.map((c, i) => this.renderItem(c, i)) }
      </div>
    );
  }
}

