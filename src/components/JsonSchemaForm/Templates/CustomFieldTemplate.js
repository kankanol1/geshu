import React from 'react';
import { Row, Col } from 'antd';

const CustomFieldTemplate = (props) => {
  const { id, classNames, label, displayLabel, help,
    required, title, errors, children, schema } = props;
  const { description } = props;
  const isInsideArray = description.props.description === undefined;
  let descElement = description;
  if (required) {
    // to add * to description suffix.
    descElement = React.cloneElement(description, { description: `${description.props.description} *` });
  }
  if (displayLabel) {
    return (
      <Row className={classNames}>
        <Col span={isInsideArray ? 0 : 8}><legend> {descElement}</legend></Col>
        <Col span={isInsideArray ? 24 : 16}>{children}</Col>
        {/* uncomment the following line will display errors for each item */}
        {/* {errors} */}
        {help}
      </Row>
    );
  }
  return (
    <div className={classNames}>
      {children}
      {/* uncomment the following line will display errors for each item */}
      {/* {errors} */}
      {help}
    </div>
  );
};

export default CustomFieldTemplate;
