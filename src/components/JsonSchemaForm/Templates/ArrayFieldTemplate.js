
import React from 'react';
import { Row, Col, Button, Icon } from 'antd';
import styles from './ArrayFieldTemplate.less';

const ButtonGroup = Button.Group;

const ArrayFieldTemplate = (props) => {
  const { schema, title } = props;
  const { description } = schema;
  return (
    <div className={`${props.className} ${styles.container}`}>
      <Row className={styles.arrayHeader}>
        <Col span={20}><span style={{ lineHeight: '36px' }}>{description === undefined ? title : description}</span></Col>
        {props.canAdd && (
          <Col span={4}>
            <Button onClick={props.onAddClick} type="primary">
              <Icon type="plus" />
            </Button>
          </Col>
      )}
      </Row>
      {props.items &&
        props.items.map(element => (
          <Row key={element.index} className="arr-row">
            <Col span={17}>{element.children}</Col>
            <Col span={7}>
              <ButtonGroup>
                <Button
                  onClick={element.onReorderClick(
                    element.index,
                    element.index - 1
                  )}
                  disabled={!element.hasMoveUp}
                  className="slim-btn"
                >
                  <Icon type="up" />
                </Button>
                <Button
                  onClick={element.onReorderClick(
                    element.index,
                    element.index + 1
                  )}
                  className="slim-btn"
                  disabled={!element.hasMoveDown}
                >
                  <Icon type="down" />
                </Button>
                <Button onClick={element.onDropIndexClick(element.index)} className="slim-btn" type="danger">
                  <Icon type="close" />
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        ))}

    </div>
  );
};

export default ArrayFieldTemplate;
