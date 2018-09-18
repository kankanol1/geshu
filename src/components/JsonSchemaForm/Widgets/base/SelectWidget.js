import React from 'react';
import { Row, Col, Select } from 'antd';

const asNumber = (value) => {
  if (value === '') {
    return undefined;
  }
  if (/\.$/.test(value)) {
    // "3." can't really be considered a number even if it parses in js. The
    // user is most likely entering a float.
    return value;
  }
  if (/\.0$/.test(value)) {
    // we need to return this as a string here, to allow for input like 3.07
    return value;
  }
  const n = Number(value);
  const valid = typeof n === 'number' && !Number.isNaN(n);

  if (/\.\d*0$/.test(value)) {
    // It's a number, that's cool - but we need it as a string so it doesn't screw
    // with the user when entering dollar amounts or other values (such as those with
    // specific precision or number of significant digits)
    return value;
  }

  return valid ? n : value;
};

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({ type, items }, value) {
  if (value === '') {
    return undefined;
  } else if (
    type === 'array' &&
    items &&
    ['number', 'integer'].includes(items.type)
  ) {
    return value.map(asNumber);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }
  return value;
}

function getValue(event, multiple) {
  if (multiple) {
    return [].slice
      .call(event.target.options)
      .filter(o => o.selected)
      .map(o => o.value);
  } else {
    return event.target.value;
  }
}

class SelectWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.value,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      selected: props.value,
    });
  }

  render() {
    const {
      schema,
      id,
      options,
      value,
      required,
      disabled,
      readonly,
      multiple,
      autofocus,
      onChange,
      onBlur,
      onFocus,
      placeholder,
    } = this.props;
    const { enumOptions, enumDisabled } = options;
    // const emptyValue = multiple ? [] : '';
    const { description } = schema;
    const { selected } = this.state;
    return (
      <Row>
        <Col span={8}><legend> {description} {required ? '*' : null} </legend></Col>
        <Col span={16}>
          <Select
            id={id}
            multiple={multiple}
            style={{ width: '100%' }}
            className="form-control"
            value={selected}
            required={required}
            disabled={disabled || readonly}
            placeholder={placeholder === undefined || '' || ' ' ? '请选择' : placeholder}
            onBlur={
              onBlur &&
              ((newValue) => {
                // const newValue = getValue(event, multiple);
                onBlur(id, processValue(schema, newValue));
              })
            }
            onFocus={
              onFocus &&
              ((newValue) => {
                // const newValue = getValue(event, multiple);
                onFocus(id, processValue(schema, newValue));
              })
            }
            onChange={(newValue, opt) => {
              // const newValue = getValue(event, multiple);
              onChange(processValue(schema, newValue));
            }}
          >
            {/* {!multiple && !schema.default &&
              <Select.Option key="*" value="">{}</Select.Option>
            } */}
            {enumOptions.map((item, i) => {
              const thisDisabled = enumDisabled && enumDisabled.indexOf(item.value) !== -1;
              return (
                <Select.Option key={i} value={item.value} disabled={thisDisabled}>
                  {item.label}
                </Select.Option>
              );
          })}
          </Select>
        </Col>
      </Row>
    );
  }
}


export default SelectWidget;
